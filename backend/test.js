const mongoose = require("mongoose");
require("dotenv").config();
(async () => {
  if (!process.env.MONGO_URI) throw new Error("Set MONGO_URI in backend/.env first");
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connection succeeded");
  await mongoose.disconnect();
})().catch(error => { console.error("MongoDB connection failed:", error.message); process.exitCode = 1; });
