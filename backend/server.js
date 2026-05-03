const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const Attendance = require("./models/Attendance");

const app = express();
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("🚀 Backend is running perfectly");
});
/* ✅ ROOT ROUTE (FIXES RAILWAY ERROR) */
app.get("/", (req, res) => {
  res.send("🚀 Smart Cloud Attendance API is running");
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
  const { name, image } = req.body;

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const already = await Attendance.findOne({
      email: name,
      date: { $gte: today }
    });

    if (already) {
      return res.status(400).json("Already marked today");
    }

    const newEntry = new Attendance({
      email: name,
      date: new Date(),
      image
    });

    await newEntry.save();

    res.json("Attendance marked");
  } catch (err) {
    console.log(err);
    res.status(500).json("Error");
  }
});

/* DELETE */
app.delete("/api/attendance/:id", async (req, res) => {
  try {
    await Attendance.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json("Delete error");
  }
});

/* DB */
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on port " + PORT);
});