const router = require("express").Router();
const Attendance = require("../models/Attendance");
const User = require("../models/User");

/* MARK ATTENDANCE */
router.post("/mark", async (req, res) => {
  const { userId } = req.body;

  const user = await User.findById(userId);

  if (!user) {
    return res.status(400).json("User not found");
  }

  const record = new Attendance({
    userId,
    email: user.email
  });

  await record.save();
  res.json(record);
});

/* GET ALL */
router.get("/", async (req, res) => {
  const data = await Attendance.find().sort({ date: -1 });
  res.json(data);
});

/* EMAIL ATTENDANCE */
router.post("/email", async (req, res) => {
  const { email } = req.body;

  try {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    const existing = await Attendance.findOne({
      email,
      date: { $gte: oneHourAgo }
    });

    if (existing) {
      return res.status(400).json("Already marked. Try after 1 hour.");
    }

    const record = new Attendance({ email });
    await record.save();

    res.json("Attendance marked successfully");
  } catch (err) {
    console.log(err);
    res.status(500).json("Server error");
  }
});

/* DELETE ONE */
router.delete("/:id", async (req, res) => {
  try {
    await Attendance.findByIdAndDelete(req.params.id);
    res.json("Deleted successfully");
  } catch (err) {
    res.status(500).json("Delete failed");
  }
});

/* DELETE ALL */
router.delete("/", async (req, res) => {
  try {
    await Attendance.deleteMany({});
    res.json("All attendance cleared");
  } catch (err) {
    res.status(500).json("Clear failed");
  }
});

module.exports = router;