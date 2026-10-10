const prisma = require("../utils/prismaClient");
const { validateServiceRequest } = require("../middleware/validators");

async function createServiceRequest(req, res) {
  const check = validateServiceRequest(req.body);
  if (!check.ok) return res.status(400).json({ error: check.error });

  const { entrepreneurId, description } = req.body;

  try {
    const entrepreneur = await prisma.entrepreneur.findUnique({ where: { id: entrepreneurId } });
    if (!entrepreneur) return res.status(404).json({ error: "Entrepreneur not found." });

    // Can't book yourself
    if (entrepreneur.userId === req.user.id) {
      return res.status(400).json({ error: "You can't send a service request to yourself." });
    }

    if (!entrepreneur.isAvailable) {
      return res.status(400).json({ error: "This entrepreneur is not currently available." });
    }

    const request = await prisma.serviceRequest.create({
      data: { customerId: req.user.id, entrepreneurId, description: description.trim() },
    });
    res.status(201).json(request);
  } catch (err) {
    console.error("createServiceRequest error:", err);
    res.status(500).json({ error: "Could not send service request." });
  }
}

async function listMyRequests(req, res) {
  try {
    const requests = await prisma.serviceRequest.findMany({
      where: { customerId: req.user.id },
      include: { entrepreneur: { include: { user: { select: { name: true } } } } },
      orderBy: { createdAt: "desc" },
    });
    res.json(requests);
  } catch (err) {
    console.error("listMyRequests error:", err);
    res.status(500).json({ error: "Could not load your service requests." });
  }
}

async function listReceivedRequests(req, res) {
  try {
    const entrepreneur = await prisma.entrepreneur.findUnique({ where: { userId: req.user.id } });
    if (!entrepreneur) return res.status(404).json({ error: "Entrepreneur profile not found." });

    const requests = await prisma.serviceRequest.findMany({
      where: { entrepreneurId: entrepreneur.id },
      include: { customer: { select: { name: true, phone: true } } },
      orderBy: { createdAt: "desc" },
    });
    res.json(requests);
  } catch (err) {
    console.error("listReceivedRequests error:", err);
    res.status(500).json({ error: "Could not load received requests." });
  }
}

async function updateRequestStatus(req, res) {
  const { status } = req.body;
  const allowed = ["ACCEPTED", "REJECTED", "COMPLETED"];
  if (!allowed.includes(status)) {
    return res.status(400).json({ error: `Status must be one of: ${allowed.join(", ")}.` });
  }

  try {
    const entrepreneur = await prisma.entrepreneur.findUnique({ where: { userId: req.user.id } });
    if (!entrepreneur) return res.status(404).json({ error: "Entrepreneur profile not found." });

    const request = await prisma.serviceRequest.findUnique({ where: { id: req.params.id } });
    if (!request || request.entrepreneurId !== entrepreneur.id) {
      return res.status(404).json({ error: "Service request not found." });
    }

    // Closed requests can't change state
    if (request.status === "COMPLETED" || request.status === "REJECTED") {
      return res.status(400).json({ error: "This request is already closed." });
    }

    const updated = await prisma.serviceRequest.update({
      where: { id: req.params.id },
      data: { status },
    });
    res.json(updated);
  } catch (err) {
    console.error("updateRequestStatus error:", err);
    res.status(500).json({ error: "Could not update request status." });
  }
}

module.exports = { createServiceRequest, listMyRequests, listReceivedRequests, updateRequestStatus };
