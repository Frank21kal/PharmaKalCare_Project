const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ["Admin", "Manager", "Pharmacist", "Cashier"], default: "Cashier" },
  profilePicture: { type: String, default: null }
}, { timestamps: true });
module.exports = mongoose.model("User", userSchema);
