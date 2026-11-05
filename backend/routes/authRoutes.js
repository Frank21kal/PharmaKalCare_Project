const express = require("express");
const router = express.Router();
const { registerUser, setupAdmin, loginUser } = require("../controllers/authController");
router.post("/register", registerUser);
router.post("/setup-admin", setupAdmin);
router.post("/login", loginUser);
module.exports = router;
