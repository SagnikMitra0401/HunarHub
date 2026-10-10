const prisma = require("../utils/prismaClient");

async function listPendingEntrepreneurs(req, res) {
  try {
    const pending = await prisma.entrepreneur.findMany({
      where: { isVerified: false },
      include: { user: { select: { name: true, email: true } }, category: true },
    });
    res.json(pending);
  } catch (err) {
    console.error("listPendingEntrepreneurs error:", err);
    res.status(500).json({ error: "Could not load pending verifications." });
  }
}

async function listAllOrders(req, res) {
  try {
    const orders = await prisma.order.findMany({
      include: {
        customer: { select: { name: true, email: true } },
        product: { include: { entrepreneur: { include: { user: { select: { name: true } } } } } },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(orders);
  } catch (err) {
    console.error("listAllOrders error:", err);
    res.status(500).json({ error: "Could not load orders." });
  }
}

async function listAllServiceRequests(req, res) {
  try {
    const requests = await prisma.serviceRequest.findMany({
      include: {
        customer: { select: { name: true, email: true } },
        entrepreneur: { include: { user: { select: { name: true } } } },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(requests);
  } catch (err) {
    console.error("listAllServiceRequests error:", err);
    res.status(500).json({ error: "Could not load service requests." });
  }
}

async function resolveOrderDispute(req, res) {
  try {
    const order = await prisma.order.findUnique({ where: { id: req.params.id } });
    if (!order) return res.status(404).json({ error: "Order not found." });

    const updated = await prisma.order.update({
      where: { id: req.params.id },
      data: { status: "CANCELLED" },
    });
    res.json(updated);
  } catch (err) {
    console.error("resolveOrderDispute error:", err);
    res.status(500).json({ error: "Could not cancel order." });
  }
}

async function resolveServiceRequestDispute(req, res) {
  try {
    const request = await prisma.serviceRequest.findUnique({ where: { id: req.params.id } });
    if (!request) return res.status(404).json({ error: "Service request not found." });

    const updated = await prisma.serviceRequest.update({
      where: { id: req.params.id },
      data: { status: "REJECTED" },
    });
    res.json(updated);
  } catch (err) {
    console.error("resolveServiceRequestDispute error:", err);
    res.status(500).json({ error: "Could not reject service request." });
  }
}

async function getAnalytics(req, res) {
  try {
    const [entrepreneurCount, userCount, requestGroups, completedOrders, reviewStats] =
      await Promise.all([
        prisma.entrepreneur.count(),
        prisma.user.count({ where: { role: "CUSTOMER" } }),
        prisma.serviceRequest.groupBy({ by: ["status"], _count: true }),
        prisma.order.findMany({ where: { status: "COMPLETED" }, select: { quantity: true, totalPrice: true } }),
        prisma.review.aggregate({ _avg: { rating: true } }),
      ]);

    const totalRequests = requestGroups.reduce((sum, g) => sum + g._count, 0);
    const movedForward = requestGroups
      .filter((g) => g.status === "ACCEPTED" || g.status === "COMPLETED")
      .reduce((sum, g) => sum + g._count, 0);

    const conversionRate = totalRequests > 0 ? movedForward / totalRequests : 0;
    const salesVolume = completedOrders.reduce((sum, o) => sum + o.quantity, 0);
    const totalRevenue = completedOrders.reduce((sum, o) => sum + Number(o.totalPrice), 0);

    res.json({
      registeredEntrepreneurs: entrepreneurCount,
      activeUsers: userCount,
      serviceRequestConversionRate: conversionRate,
      productSalesVolume: salesVolume,
      averageEntrepreneurEarnings: entrepreneurCount > 0 ? totalRevenue / entrepreneurCount : 0,
      averageCustomerSatisfaction: reviewStats._avg.rating || 0,
    });
  } catch (err) {
    console.error("getAnalytics error:", err);
    res.status(500).json({ error: "Could not load analytics." });
  }
}

module.exports = {
  listPendingEntrepreneurs,
  listAllOrders,
  listAllServiceRequests,
  resolveOrderDispute,
  resolveServiceRequestDispute,
  getAnalytics,
};
