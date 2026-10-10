const express = require("express");
const router = express.Router();
const {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const { requireAuth, requireRole } = require("../middleware/auth");

router.get("/", listProducts);
router.get("/:id", getProduct);
router.post("/", requireAuth, requireRole("ENTREPRENEUR"), createProduct);
router.put("/:id", requireAuth, requireRole("ENTREPRENEUR"), updateProduct);
router.delete("/:id", requireAuth, requireRole("ENTREPRENEUR"), deleteProduct);

module.exports = router;
