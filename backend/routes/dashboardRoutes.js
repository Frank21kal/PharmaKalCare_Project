const express = require("express");
const router = express.Router();
const { protect, allowRoles } = require("../middleware/auth");
const c = require("../controllers/dashboardController");
router.use(protect);
router.get("/", c.getDashboardStats);
router.get("/top-medicines", c.getTopSellingMedicines);
module.exports = router;

