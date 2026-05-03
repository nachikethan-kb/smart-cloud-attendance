const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const Attendance = require("./models/Attendance");

const app = express();

/* MIDDLEWARE */
app.use(cors());
app.use(express.json());

/* ✅ ROOT ROUTE */
app.get("/", (req, res) => {
  res.send("🚀 Backend is LIVE on Render");
});

/* ✅ TEST ROUTE */
app.get("/test", (req, res) => {
  res.json({ message: "API working perfectly" });
});

/* ROUTES */
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/attendance", require("./routes/attendanceRoutes"));
app.use("/admin", require("./routes/adminRoutes"));

/* 🔥 FACE ATTENDANCE */
app.post("/api/attendance/face", async (req, res) => {
  try {
    const { name, image } = req.body;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const exists = await Attendance.findOne({
      email: name,
      date: { $gte: today }
    });

    if (exists) {
      return res.status(400).json("Already marked today");
    }

    const entry = new Attendance({
      email: name,
      image,
      date: new Date()
    });

    await entry.save();

    res.json("Attendance marked");
  } catch (err) {
    console.error(err);
    res.status(500).json("Server error");
  }
});

/* DB */
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

/* PORT (IMPORTANT FOR RENDER) */
const PORT = process.env.PORT || 10000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});