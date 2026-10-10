const prisma = require("../utils/prismaClient");
const { validateOrder } = require("../middleware/validators");

async function createOrder(req, res) {
  const check = validateOrder(req.body);
  if (!check.ok) return res.status(400).json({ error: check.error });

  const { productId, quantity } = req.body;
  const qty = quantity && Number(quantity) > 0 ? Math.floor(Number(quantity)) : 1;

  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { entrepreneur: true },
    });
    if (!product) return res.status(404).json({ error: "Product not found." });

    // Entrepreneurs can't buy their own products
    if (product.entrepreneur.userId === req.user.id) {
      return res.status(400).json({ error: "You can't purchase your own products." });
    }

    const totalPrice = Number(product.price) * qty;
    const order = await prisma.order.create({
      data: { customerId: req.user.id, productId, quantity: qty, totalPrice },
    });
    res.status(201).json(order);
  } catch (err) {
    console.error("createOrder error:", err);
    res.status(500).json({ error: "Could not place order." });
  }
}

async function listMyOrders(req, res) {
  try {
    const orders = await prisma.order.findMany({
      where: { customerId: req.user.id },
      include: {
        product: {
          include: { entrepreneur: { include: { user: { select: { name: true } } } } },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(orders);
  } catch (err) {
    console.error("listMyOrders error:", err);
    res.status(500).json({ error: "Could not load your orders." });
  }
}

async function listReceivedOrders(req, res) {
  try {
    const entrepreneur = await prisma.entrepreneur.findUnique({ where: { userId: req.user.id } });
    if (!entrepreneur) return res.status(404).json({ error: "Entrepreneur profile not found." });

    const orders = await prisma.order.findMany({
      where: { product: { entrepreneurId: entrepreneur.id } },
      include: { product: true, customer: { select: { name: true, phone: true } } },
      orderBy: { createdAt: "desc" },
    });
    res.json(orders);
  } catch (err) {
    console.error("listReceivedOrders error:", err);
    res.status(500).json({ error: "Could not load received orders." });
  }
}

async function updateOrderStatus(req, res) {
  const { status } = req.body;
  const allowed = ["CONFIRMED", "COMPLETED", "CANCELLED"];
  if (!allowed.includes(status)) {
    return res.status(400).json({ error: `Status must be one of: ${allowed.join(", ")}.` });
  }

  try {
    const entrepreneur = await prisma.entrepreneur.findUnique({ where: { userId: req.user.id } });
    if (!entrepreneur) return res.status(404).json({ error: "Entrepreneur profile not found." });

    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: { product: true },
    });

    if (!order || order.product.entrepreneurId !== entrepreneur.id) {
      return res.status(404).json({ error: "Order not found." });
    }

    // Prevent moving backwards — completed/cancelled orders are final
    if (order.status === "COMPLETED" || order.status === "CANCELLED") {
      return res.status(400).json({ error: "This order is already closed." });
    }

    const updated = await prisma.order.update({ where: { id: req.params.id }, data: { status } });
    res.json(updated);
  } catch (err) {
    console.error("updateOrderStatus error:", err);
    res.status(500).json({ error: "Could not update order status." });
  }
}

module.exports = { createOrder, listMyOrders, listReceivedOrders, updateOrderStatus };
