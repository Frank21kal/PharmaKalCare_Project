const Sale = require("../models/Sale");
const Medicine = require("../models/Medicine");
async function getSummary(req, res) {
  const from = req.query.from ? new Date(req.query.from) : new Date(Date.now() - 30 * 86400000);
  const to = req.query.to ? new Date(req.query.to) : new Date();
  if (!Number.isFinite(from.getTime()) || !Number.isFinite(to.getTime()) || from > to) return res.status(400).json({ message: "Provide a valid date range" });
  to.setHours(23, 59, 59, 999);
  const match = { createdAt: { $gte: from, $lte: to } };
  const [sales, topMedicines, stock, lowStock] = await Promise.all([
    Sale.aggregate([{ $match: match }, { $group: { _id: null, transactions: { $sum: 1 }, units: { $sum: "$quantitySold" }, revenue: { $sum: "$totalPrice" } } }]),
    Sale.aggregate([{ $match: match }, { $group: { _id: "$medicineName", units: { $sum: "$quantitySold" }, revenue: { $sum: "$totalPrice" } } }, { $sort: { units: -1 } }, { $limit: 10 }]),
    Medicine.countDocuments(),
    Medicine.countDocuments({ quantity: { $lt: 10 } })
  ]);
  res.json({ from, to, sales: sales[0] || { transactions: 0, units: 0, revenue: 0 }, topMedicines, inventory: { medicines: stock, lowStock } });
}
module.exports = { getSummary };
