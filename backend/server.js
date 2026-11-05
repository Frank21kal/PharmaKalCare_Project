const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json({ limit: "5mb" }));
app.use("/uploads", express.static(path.join(__dirname, "uploads"), { fallthrough: false }));

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/medicines", require("./routes/medicineRoutes"));
app.use("/api/sales", require("./routes/salesRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));
app.use("/api/reports", require("./routes/reportRoutes"));
app.get("/", (req, res) => res.json({ message: "PharmaKalCare API Running" }));
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || (err.name === "MulterError" ? 400 : 500);
  res.status(status).json({ message: err.message || "Internal server error" });
});

const PORT = Number(process.env.PORT) || 5000;
connectDB().then(() => app.listen(PORT, () => console.log(`PharmaKalCare API listening on ${PORT}`)))
  .catch(error => { console.error("Database startup failed:", error.message); process.exit(1); });

