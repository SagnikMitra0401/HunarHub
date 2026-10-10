const prisma = require("../utils/prismaClient");
const { validateProduct } = require("../middleware/validators");

async function listProducts(req, res) {
  const { category, minPrice, maxPrice } = req.query;

  const where = {
    entrepreneur: { isVerified: true },
    ...(category ? { entrepreneur: { isVerified: true, category: { name: category } } } : {}),
    ...((minPrice || maxPrice)
      ? {
          price: {
            ...(minPrice ? { gte: Number(minPrice) } : {}),
            ...(maxPrice ? { lte: Number(maxPrice) } : {}),
          },
        }
      : {}),
  };

  try {
    const products = await prisma.product.findMany({
      where,
      include: {
        entrepreneur: { include: { user: { select: { name: true } }, category: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(products);
  } catch (err) {
    console.error("listProducts error:", err);
    res.status(500).json({ error: "Could not load products." });
  }
}

async function getProduct(req, res) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: { entrepreneur: { include: { user: { select: { name: true } } } } },
    });
    if (!product) return res.status(404).json({ error: "Product not found." });
    res.json(product);
  } catch (err) {
    console.error("getProduct error:", err);
    res.status(500).json({ error: "Could not load product." });
  }
}

async function createProduct(req, res) {
  const check = validateProduct(req.body);
  if (!check.ok) return res.status(400).json({ error: check.error });

  const { name, description, price, imageUrl } = req.body;

  try {
    const entrepreneur = await prisma.entrepreneur.findUnique({ where: { userId: req.user.id } });
    if (!entrepreneur) return res.status(404).json({ error: "Entrepreneur profile not found." });

    const product = await prisma.product.create({
      data: {
        entrepreneurId: entrepreneur.id,
        name: name.trim(),
        description: description?.trim() || null,
        price: Number(price),
        imageUrl: imageUrl?.trim() || null,
      },
    });
    res.status(201).json(product);
  } catch (err) {
    console.error("createProduct error:", err);
    res.status(500).json({ error: "Could not create product." });
  }
}

async function updateProduct(req, res) {
  try {
    const entrepreneur = await prisma.entrepreneur.findUnique({ where: { userId: req.user.id } });
    if (!entrepreneur) return res.status(404).json({ error: "Entrepreneur profile not found." });

    const product = await prisma.product.findUnique({ where: { id: req.params.id } });
    if (!product || product.entrepreneurId !== entrepreneur.id) {
      return res.status(404).json({ error: "Product not found." });
    }

    const { name, description, price, imageUrl } = req.body;
    if (price !== undefined && !(Number(price) > 0)) {
      return res.status(400).json({ error: "Price must be a positive number." });
    }

    const data = {};
    if (name !== undefined) data.name = name.trim();
    if (description !== undefined) data.description = description?.trim() || null;
    if (price !== undefined) data.price = Number(price);
    if (imageUrl !== undefined) data.imageUrl = imageUrl?.trim() || null;

    const updated = await prisma.product.update({ where: { id: req.params.id }, data });
    res.json(updated);
  } catch (err) {
    console.error("updateProduct error:", err);
    res.status(500).json({ error: "Could not update product." });
  }
}

async function deleteProduct(req, res) {
  try {
    const entrepreneur = await prisma.entrepreneur.findUnique({ where: { userId: req.user.id } });
    if (!entrepreneur) return res.status(404).json({ error: "Entrepreneur profile not found." });

    const product = await prisma.product.findUnique({ where: { id: req.params.id } });
    if (!product || product.entrepreneurId !== entrepreneur.id) {
      return res.status(404).json({ error: "Product not found." });
    }

    await prisma.product.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (err) {
    console.error("deleteProduct error:", err);
    res.status(500).json({ error: "Could not delete product." });
  }
}

module.exports = { listProducts, getProduct, createProduct, updateProduct, deleteProduct };
