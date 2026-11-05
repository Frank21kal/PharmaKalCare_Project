const Sale = require("../models/Sale");
const Medicine = require("../models/Medicine");
async function createSale(req, res) {
  const { medicineId } = req.body;
  const quantitySold = Number(req.body.quantitySold);
  if (!medicineId || !Number.isInteger(quantitySold) || quantitySold < 1) return res.status(400).json({ message: "Choose a medicine and enter a whole number quantity above zero" });
  let updated;
  try {
    updated = await Medicine.findOneAndUpdate({ _id: medicineId, quantity: { $gte: quantitySold } }, { $inc: { quantity: -quantitySold } }, { new: true, runValidators: true });
    if (!updated) {
      const exists = await Medicine.exists({ _id: medicineId });
      return res.status(exists ? 400 : 404).json({ message: exists ? "Insufficient stock" : "Medicine not found" });
    }
    const sale = await Sale.create({ medicineId: updated._id, medicineName: updated.name, quantitySold, pricePerUnit: updated.price, totalPrice: quantitySold * updated.price, soldBy: req.user.name });
    return res.status(201).json(sale);
  } catch (error) {
    if (updated) await Medicine.updateOne({ _id: updated._id }, { $inc: { quantity: quantitySold } }).catch(() => {});
    return res.status(400).json({ message: error.message });
  }
}
async function getSales(_req, res) { res.json(await Sale.find().sort({ createdAt: -1 }).limit(500)); }
module.exports = { createSale, getSales };
