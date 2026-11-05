const mongoose = require("mongoose");
const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 120 },
  quantity: { type: Number, required: true, default: 0, min: 0, validate: Number.isInteger },
  price: { type: Number, required: true, min: 0 },
  expiryDate: { type: Date, required: true }
}, { timestamps: true });
module.exports = mongoose.model("Medicine", medicineSchema);
