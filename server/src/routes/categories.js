const express = require("express");
const router = express.Router();
const { listCategories, createCategory, deleteCategory } = require("../controllers/categoryController");
const { requireAuth, requireRole } = require("../middleware/auth");

router.get("/", listCategories);
router.post("/", requireAuth, requireRole("ADMIN"), createCategory);
router.delete("/:id", requireAuth, requireRole("ADMIN"), deleteCategory);

module.exports = router;
