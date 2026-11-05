const fs = require("fs");
const path = require("path");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { safeUser, roles } = require("./authController");
async function listUsers(_req, res) { const users = await User.find().select("-password").sort({ createdAt: -1 }); res.json(users.map(safeUser)); }
async function createUser(req, res) {
  const { name, email, password, role } = req.body;
  if (!String(name || "").trim() || !String(email || "").includes("@") || String(password || "").length < 8 || !roles.includes(role)) return res.status(400).json({ message: "Provide a name, valid email, password of at least 8 characters and valid role" });
  try { const user = await User.create({ name: name.trim(), email: email.trim().toLowerCase(), password: await bcrypt.hash(password, 12), role }); res.status(201).json(safeUser(user)); }
  catch (error) { res.status(error.code === 11000 ? 409 : 400).json({ message: error.code === 11000 ? "Email is already registered" : error.message }); }
}
async function updateUser(req, res) {
  const { name, email, role } = req.body;
  if (role && !roles.includes(role)) return res.status(400).json({ message: "Invalid role" });
  if (String(req.user._id) === req.params.id && role && role !== "Admin") return res.status(400).json({ message: "You cannot remove your own administrator role" });
  try { const user = await User.findById(req.params.id); if (!user) return res.status(404).json({ message: "User not found" }); if (name !== undefined) user.name = String(name).trim(); if (email !== undefined) user.email = String(email).trim().toLowerCase(); if (role) user.role = role; await user.save(); res.json(safeUser(user)); }
  catch (error) { res.status(error.code === 11000 ? 409 : 400).json({ message: error.code === 11000 ? "Email is already registered" : error.message }); }
}
async function deleteUser(req, res) { if (String(req.user._id) === req.params.id) return res.status(400).json({ message: "You cannot delete your own account" }); const user = await User.findByIdAndDelete(req.params.id); if (!user) return res.status(404).json({ message: "User not found" }); res.json({ message: "User deleted" }); }
async function getMe(req, res) { res.json(safeUser(req.user)); }
async function updateMe(req, res) {
  const { name, email, currentPassword, newPassword } = req.body;
  try {
    if (name !== undefined) req.user.name = String(name).trim(); if (email !== undefined) req.user.email = String(email).trim().toLowerCase();
    if (newPassword) { const full = await User.findById(req.user._id).select("+password"); if (!currentPassword || !(await bcrypt.compare(currentPassword, full.password))) return res.status(400).json({ message: "Current password is incorrect" }); if (newPassword.length < 8) return res.status(400).json({ message: "New password must contain at least 8 characters" }); req.user.password = await bcrypt.hash(newPassword, 12); }
    await req.user.save(); res.json({ message: "Profile updated", user: safeUser(req.user) });
  } catch (error) { res.status(error.code === 11000 ? 409 : 400).json({ message: error.code === 11000 ? "Email is already registered" : error.message }); }
}
async function uploadPicture(req, res) {
  if (!req.file) return res.status(400).json({ message: "Choose an image file first" });
  const previous = req.user.profilePicture; req.user.profilePicture = `/uploads/profile-pictures/${req.file.filename}`; await req.user.save();
  if (previous && previous.startsWith("/uploads/profile-pictures/")) { const oldPath = path.join(__dirname, "..", previous.replace(/^\/+/, "")); if (fs.existsSync(oldPath)) fs.unlink(oldPath, () => {}); }
  res.json({ message: "Profile picture updated", user: safeUser(req.user) });
}
module.exports = { listUsers, createUser, updateUser, deleteUser, getMe, updateMe, uploadPicture };
