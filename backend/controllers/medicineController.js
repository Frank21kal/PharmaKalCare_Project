const Medicine = require("../models/Medicine");

const escapeRegex = value => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const exactName = name => ({ name: { $regex: `^${escapeRegex(name.trim())}$`, $options: "i" } });

async function getMedicines(req, res) {
  const search = String(req.query.search || "").trim().slice(0, 100);
  const medicines = await Medicine.find(search ? { name: { $regex: escapeRegex(search), $options: "i" } } : {}).sort({ name: 1 });
  res.json(medicines);
}

async function createMedicine(req, res) {
  try {
    const { name, quantity, price, expiryDate } = req.body;
    if (typeof name !== "string" || !name.trim()) return res.status(400).json({ message: "Medicine name is required" });
    const duplicate = await Medicine.findOne({ ...exactName(name), quantity: { $gt: 0 } });
    if (duplicate) return res.status(409).json({ message: `Medicine already available: ${duplicate.name}.` });

    const medicine = await Medicine.create({ name: name.trim(), quantity, price, expiryDate });
    res.status(201).json(medicine);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function updateMedicine(req, res) {
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) return res.status(404).json({ message: "Medicine not found" });

    const { name, quantity, price, expiryDate } = req.body;
    const nextName = name === undefined ? medicine.name : String(name).trim();
    const nextQuantity = quantity === undefined ? medicine.quantity : quantity;
    if (Number(nextQuantity) > 0) {
      const duplicate = await Medicine.findOne({
        ...exactName(nextName),
        quantity: { $gt: 0 },
        _id: { $ne: medicine._id }
      });
      if (duplicate) return res.status(409).json({ message: `Medicine already available: ${duplicate.name}.` });
    }

    if (name !== undefined) medicine.name = nextName;
    if (quantity !== undefined) medicine.quantity = quantity;
    if (price !== undefined) medicine.price = price;
    if (expiryDate !== undefined) medicine.expiryDate = expiryDate;
    await medicine.save();
    res.json(medicine);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function deleteMedicine(req, res) {
  const medicine = await Medicine.findByIdAndDelete(req.params.id);
  if (!medicine) return res.status(404).json({ message: "Medicine not found" });
  res.json({ message: "Medicine deleted successfully" });
}

async function getLowStockMedicines(_req, res) {
  res.json(await Medicine.find({ quantity: { $lt: 10 } }).sort({ quantity: 1 }));
}

async function getExpiryMedicines(_req, res) {
  const today = new Date();
  const until = new Date();
  until.setDate(until.getDate() + 30);
  res.json(await Medicine.find({ expiryDate: { $gte: today, $lte: until } }).sort({ expiryDate: 1 }));
}

module.exports = { getMedicines, createMedicine, updateMedicine, deleteMedicine, getLowStockMedicines, getExpiryMedicines };
