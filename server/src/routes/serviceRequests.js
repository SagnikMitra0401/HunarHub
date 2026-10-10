const express = require("express");
const router = express.Router();
const {
  createServiceRequest,
  listMyRequests,
  listReceivedRequests,
  updateRequestStatus,
} = require("../controllers/serviceRequestController");
const { requireAuth, requireRole } = require("../middleware/auth");

router.post("/", requireAuth, requireRole("CUSTOMER"), createServiceRequest);
router.get("/mine", requireAuth, requireRole("CUSTOMER"), listMyRequests);
router.get("/received", requireAuth, requireRole("ENTREPRENEUR"), listReceivedRequests);
router.put("/:id/status", requireAuth, requireRole("ENTREPRENEUR"), updateRequestStatus);

module.exports = router;
