const express = require("express");
const router = express.Router();
const { protect, allowRoles } = require("../middleware/auth");
const { getSummary } = require("../controllers/reportController");
router.get("/summary", protect, allowRoles("Admin", "Manager"), getSummary);
module.exports = router;
