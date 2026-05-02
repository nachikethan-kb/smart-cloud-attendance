const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  email: String,
  date: Date,
  image: String
});

module.exports = mongoose.model("Attendance", attendanceSchema);