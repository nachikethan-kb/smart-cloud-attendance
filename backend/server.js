const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

/* MIDDLEWARE */
app.use(cors());
app.use(express.json());

/* ROOT ROUTE */
app.get("/", (req, res) => {
  res.send("🚀 Backend is LIVE on Render");
});

/* TEST ROUTE */
app.get("/test", (req, res) => {
  res.json({ message: "API working" });
});

/* ROUTES */
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/attendance", require("./routes/attendanceRoutes"));

/* DB */
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => {
    console.error("❌ Mongo Error:", err);
    process.exit(1);
  });

/* PORT */
const PORT = process.env.PORT || 10000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});