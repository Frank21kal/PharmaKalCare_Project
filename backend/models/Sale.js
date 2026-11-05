const mongoose = require("mongoose");
const saleSchema = new mongoose.Schema({
  medicineId: { type: mongoose.Schema.Types.ObjectId, ref: "Medicine", required: true },
  medicineName: { type: String, required: true },
  quantitySold: { type: Number, required: true, min: 1, validate: Number.isInteger },
  pricePerUnit: { type: Number, required: true, min: 0 },
  totalPrice: { type: Number, required: true, min: 0 },
  soldBy: { type: String, required: true }
}, { timestamps: true });
module.exports = mongoose.model("Sale", saleSchema);
