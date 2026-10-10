const express = require("express");
const router = express.Router();
const {
  listPendingEntrepreneurs,
  listAllOrders,
  listAllServiceRequests,
  resolveOrderDispute,
  resolveServiceRequestDispute,
  getAnalytics,
} = require("../controllers/adminController");
const { requireAuth, requireRole } = require("../middleware/auth");

router.use(requireAuth, requireRole("ADMIN"));

router.get("/entrepreneurs/pending", listPendingEntrepreneurs);
router.get("/orders", listAllOrders);
router.get("/service-requests", listAllServiceRequests);
router.put("/orders/:id/dispute", resolveOrderDispute);
router.put("/service-requests/:id/dispute", resolveServiceRequestDispute);
router.get("/analytics", getAnalytics);

module.exports = router;
