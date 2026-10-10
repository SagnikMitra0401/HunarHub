const prisma = require("../utils/prismaClient");

async function listCategories(req, res) {
  try {
    const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
    res.json(categories);
  } catch (err) {
    console.error("listCategories error:", err);
    res.status(500).json({ error: "Could not load categories." });
  }
}

async function createCategory(req, res) {
  const { name } = req.body;
  if (!name || typeof name !== "string" || name.trim().length < 2) {
    return res.status(400).json({ error: "Category name must be at least 2 characters." });
  }

  try {
    const category = await prisma.category.create({ data: { name: name.trim() } });
    res.status(201).json(category);
  } catch (err) {
    if (err.code === "P2002") {
      return res.status(409).json({ error: "That category already exists." });
    }
    console.error("createCategory error:", err);
    res.status(500).json({ error: "Could not create category." });
  }
}

async function deleteCategory(req, res) {
  try {
    const category = await prisma.category.findUnique({ where: { id: req.params.id } });
    if (!category) return res.status(404).json({ error: "Category not found." });

    await prisma.category.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (err) {
    if (err.code === "P2003") {
      return res.status(409).json({ error: "Cannot delete a category that has active entrepreneurs." });
    }
    console.error("deleteCategory error:", err);
    res.status(500).json({ error: "Could not delete category." });
  }
}

module.exports = { listCategories, createCategory, deleteCategory };
