const prisma = require("../utils/prismaClient");

async function listEntrepreneurs(req, res) {
  const { category, location, search } = req.query;

  const where = {
    isVerified: true,
    ...(category ? { category: { name: category } } : {}),
    ...(location ? { location: { contains: location.trim(), mode: "insensitive" } } : {}),
    ...(search
      ? {
          OR: [
            { user: { name: { contains: search.trim(), mode: "insensitive" } } },
            { bio: { contains: search.trim(), mode: "insensitive" } },
          ],
        }
      : {}),
  };

  try {
    const entrepreneurs = await prisma.entrepreneur.findMany({
      where,
      include: {
        user: { select: { name: true, email: true, phone: true } },
        category: true,
        products: { take: 3 },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(entrepreneurs);
  } catch (err) {
    console.error("listEntrepreneurs error:", err);
    res.status(500).json({ error: "Could not load entrepreneurs." });
  }
}

async function getEntrepreneur(req, res) {
  try {
    const entrepreneur = await prisma.entrepreneur.findUnique({
      where: { id: req.params.id },
      include: {
        user: { select: { name: true, email: true, phone: true } },
        category: true,
        products: true,
        reviews: { include: { customer: { select: { name: true } } }, orderBy: { createdAt: "desc" } },
      },
    });
    if (!entrepreneur) return res.status(404).json({ error: "Entrepreneur not found." });
    res.json(entrepreneur);
  } catch (err) {
    console.error("getEntrepreneur error:", err);
    res.status(500).json({ error: "Could not load this profile." });
  }
}

async function getMyProfile(req, res) {
  try {
    const entrepreneur = await prisma.entrepreneur.findUnique({
      where: { userId: req.user.id },
      include: { user: { select: { id: true, name: true, email: true, phone: true } }, category: true, products: true },
    });
    if (!entrepreneur) return res.status(404).json({ error: "Entrepreneur profile not found." });
    res.json(entrepreneur);
  } catch (err) {
    console.error("getMyProfile error:", err);
    res.status(500).json({ error: "Could not load your profile." });
  }
}

async function updateMyProfile(req, res) {
  const { bio, location, priceRange, categoryId, isAvailable } = req.body;

  try {
    const entrepreneur = await prisma.entrepreneur.findUnique({ where: { userId: req.user.id } });
    if (!entrepreneur) return res.status(404).json({ error: "Entrepreneur profile not found." });

    const data = {};
    if (bio !== undefined) data.bio = bio?.trim() || null;
    if (location !== undefined) data.location = location?.trim() || null;
    if (priceRange !== undefined) data.priceRange = priceRange?.trim() || null;
    if (categoryId !== undefined) data.categoryId = categoryId;
    if (typeof isAvailable === "boolean") data.isAvailable = isAvailable;

    const updated = await prisma.entrepreneur.update({ where: { userId: req.user.id }, data });
    res.json(updated);
  } catch (err) {
    console.error("updateMyProfile error:", err);
    res.status(500).json({ error: "Could not update your profile." });
  }
}

async function getEarnings(req, res) {
  try {
    // Fetch both in parallel — no pre-fetch needed since we can filter by userId
    const [orders, serviceRequestCount] = await Promise.all([
      prisma.order.findMany({
        where: {
          status: "COMPLETED",
          product: { entrepreneur: { userId: req.user.id } },
        },
        select: { totalPrice: true },
      }),
      prisma.serviceRequest.count({
        where: { entrepreneur: { userId: req.user.id }, status: "COMPLETED" },
      }),
    ]);

    const totalEarnings = orders.reduce((sum, o) => sum + Number(o.totalPrice), 0);

    res.json({
      totalEarnings,
      completedOrderCount: orders.length,
      completedServiceCount: serviceRequestCount,
    });
  } catch (err) {
    console.error("getEarnings error:", err);
    res.status(500).json({ error: "Could not load earnings." });
  }
}

async function verifyEntrepreneur(req, res) {
  try {
    const entrepreneur = await prisma.entrepreneur.findUnique({ where: { id: req.params.id } });
    if (!entrepreneur) return res.status(404).json({ error: "Entrepreneur not found." });

    const updated = await prisma.entrepreneur.update({
      where: { id: req.params.id },
      data: { isVerified: true },
    });
    res.json(updated);
  } catch (err) {
    console.error("verifyEntrepreneur error:", err);
    res.status(500).json({ error: "Could not verify this entrepreneur." });
  }
}

module.exports = { listEntrepreneurs, getEntrepreneur, getMyProfile, updateMyProfile, getEarnings, verifyEntrepreneur };
