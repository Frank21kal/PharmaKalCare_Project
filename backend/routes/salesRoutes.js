const express = require("express");
const router = express.Router();
const { protect, allowRoles } = require("../middleware/auth");
const c = require("../controllers/salesController");
router.use(protect);
router.post("/", allowRoles("Admin", "Manager", "Pharmacist", "Cashier"), c.createSale);
router.get("/", c.getSales);
module.exports = router;
