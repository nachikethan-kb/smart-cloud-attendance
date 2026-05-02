const mongoose = require("mongoose");

const faceSchema = new mongoose.Schema({
  name: String,
  descriptors: [[Number]] // multiple samples
});

module.exports = mongoose.model("Face", faceSchema);