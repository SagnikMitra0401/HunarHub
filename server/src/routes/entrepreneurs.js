const express = require("express");
const router = express.Router();
const {
  listEntrepreneurs,
  getEntrepreneur,
  getMyProfile,
  updateMyProfile,
  getEarnings,
  verifyEntrepreneur,
} = require("../controllers/entrepreneurController");
const { requireAuth, requireRole } = require("../middleware/auth");

// Specific routes before the ":id" param route
router.get("/me/dashboard", requireAuth, requireRole("ENTREPRENEUR"), getMyProfile);
router.put("/me", requireAuth, requireRole("ENTREPRENEUR"), updateMyProfile);
router.get("/me/earnings", requireAuth, requireRole("ENTREPRENEUR"), getEarnings);

router.get("/", listEntrepreneurs);
router.get("/:id", getEntrepreneur);
router.put("/:id/verify", requireAuth, requireRole("ADMIN"), verifyEntrepreneur);

module.exports = router;
