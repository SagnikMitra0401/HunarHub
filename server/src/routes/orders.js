const express = require("express");
const router = express.Router();
const {
  createOrder,
  listMyOrders,
  listReceivedOrders,
  updateOrderStatus,
} = require("../controllers/orderController");
const { requireAuth, requireRole } = require("../middleware/auth");

router.post("/", requireAuth, requireRole("CUSTOMER"), createOrder);
router.get("/mine", requireAuth, requireRole("CUSTOMER"), listMyOrders);
router.get("/received", requireAuth, requireRole("ENTREPRENEUR"), listReceivedOrders);
router.put("/:id/status", requireAuth, requireRole("ENTREPRENEUR"), updateOrderStatus);

module.exports = router;
