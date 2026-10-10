const prisma = require("../utils/prismaClient");
const { validateReview } = require("../middleware/validators");

async function createReview(req, res) {
  const check = validateReview(req.body);
  if (!check.ok) return res.status(400).json({ error: check.error });

  const { entrepreneurId, rating, comment, orderId, serviceRequestId } = req.body;

  try {
    // Verify the linked order belongs to this customer and is completed
    if (orderId) {
      const order = await prisma.order.findUnique({ where: { id: orderId } });
      if (!order || order.customerId !== req.user.id) {
        return res.status(403).json({ error: "You can only review your own orders." });
      }
      if (order.status !== "COMPLETED") {
        return res.status(400).json({ error: "You can only review a completed order." });
      }
      const existing = await prisma.review.findUnique({ where: { orderId } });
      if (existing) {
        return res.status(409).json({ error: "You have already reviewed this order." });
      }
    }

    // Verify the linked service request belongs to this customer and is completed
    if (serviceRequestId) {
      const request = await prisma.serviceRequest.findUnique({ where: { id: serviceRequestId } });
      if (!request || request.customerId !== req.user.id) {
        return res.status(403).json({ error: "You can only review your own service requests." });
      }
      if (request.status !== "COMPLETED") {
        return res.status(400).json({ error: "You can only review a completed service request." });
      }
      const existing = await prisma.review.findUnique({ where: { serviceRequestId } });
      if (existing) {
        return res.status(409).json({ error: "You have already reviewed this service request." });
      }
    }

    const review = await prisma.review.create({
      data: {
        customerId: req.user.id,
        entrepreneurId,
        rating: Math.round(Number(rating)),
        comment: comment?.trim() || null,
        orderId: orderId || null,
        serviceRequestId: serviceRequestId || null,
      },
    });
    res.status(201).json(review);
  } catch (err) {
    console.error("createReview error:", err);
    res.status(500).json({ error: "Could not submit review." });
  }
}

async function listEntrepreneurReviews(req, res) {
  try {
    const reviews = await prisma.review.findMany({
      where: { entrepreneurId: req.params.entrepreneurId },
      include: { customer: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    });
    res.json(reviews);
  } catch (err) {
    console.error("listEntrepreneurReviews error:", err);
    res.status(500).json({ error: "Could not load reviews." });
  }
}

module.exports = { createReview, listEntrepreneurReviews };
