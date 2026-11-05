const Medicine = require("../models/Medicine");
const Sale = require("../models/Sale");
async function getDashboardStats(_req, res) {
  const [totalMedicines, totalSales, revenueRows, lowStock] = await Promise.all([
    Medicine.countDocuments(), Sale.countDocuments(), Sale.aggregate([{ $group: { _id: null, revenue: { $sum: "$totalPrice" } } }]), Medicine.countDocuments({ quantity: { $lt: 10 } })
  ]);
  res.json({ totalMedicines, totalSales, revenue: revenueRows[0]?.revenue || 0, lowStock });
}
async function getTopSellingMedicines(_req, res) {
  const rows = await Sale.aggregate([{ $group: { _id: "$medicineName", totalSold: { $sum: "$quantitySold" } } }, { $sort: { totalSold: -1 } }, { $limit: 5 }]);
  res.json(rows);
}
module.exports = { getDashboardStats, getTopSellingMedicines };
