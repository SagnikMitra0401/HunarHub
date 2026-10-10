const express = require("express");
const router = express.Router();
const { createReview, listEntrepreneurReviews } = require("../controllers/reviewController");
const { requireAuth, requireRole } = require("../middleware/auth");

router.post("/", requireAuth, requireRole("CUSTOMER"), createReview);
router.get("/entrepreneur/:entrepreneurId", listEntrepreneurReviews);

module.exports = router;
