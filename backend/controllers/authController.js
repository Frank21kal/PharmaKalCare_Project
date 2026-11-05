const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const roles = ["Admin", "Manager", "Pharmacist", "Cashier"];
const safeUser = user => ({ id: user._id, name: user.name, email: user.email, role: user.role, profilePicture: user.profilePicture || null });
async function registerUser(req, res) {
  try {
    const name = String(req.body.name || "").trim(), email = String(req.body.email || "").trim().toLowerCase(), password = String(req.body.password || "");
    if (!name || !email.includes("@") || password.length < 8) return res.status(400).json({ message: "Enter a name, valid email and password (at least 8 characters)" });
    if (!(await User.exists({ role: "Admin" }))) return res.status(403).json({ message: "An administrator must complete first-time setup before public registration is enabled" });
    const user = await User.create({ name, email, password: await bcrypt.hash(password, 12), role: "Cashier" });
    res.status(201).json({ message: "Cashier account registered. Ask an administrator to assign another role.", user: safeUser(user) });
  } catch (error) { res.status(error.code === 11000 ? 409 : 400).json({ message: error.code === 11000 ? "Email is already registered" : error.message }); }
}
async function setupAdmin(req, res) {
  try {
    if (!process.env.INITIAL_ADMIN_KEY || req.body.setupKey !== process.env.INITIAL_ADMIN_KEY) return res.status(403).json({ message: "Initial administrator setup key is invalid" });
    if (await User.exists({})) return res.status(409).json({ message: "Initial setup is already complete" });
    const { name, email, password } = req.body;
    if (!String(name || "").trim() || !String(email || "").includes("@") || String(password || "").length < 12) return res.status(400).json({ message: "Provide name, email and a password of at least 12 characters" });
    const user = await User.create({ name: name.trim(), email: email.trim().toLowerCase(), password: await bcrypt.hash(password, 12), role: "Admin" });
    res.status(201).json({ message: "Initial administrator created. Remove INITIAL_ADMIN_KEY from the environment now.", user: safeUser(user) });
  } catch (error) { res.status(400).json({ message: error.message }); }
}
async function loginUser(req, res) {
  try {
    const email = String(req.body.email || "").trim().toLowerCase(), password = String(req.body.password || "");
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await bcrypt.compare(password, user.password))) return res.status(401).json({ message: "Invalid email or password" });
    if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not configured");
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: safeUser(user) });
  } catch (error) { res.status(500).json({ message: error.message }); }
}
module.exports = { registerUser, setupAdmin, loginUser, safeUser, roles };


