const router = require("express").Router();

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  console.log("ADMIN LOGIN HIT:", email, password); // 🔥 DEBUG

  if (email === "admin@gmail.com" && password === "admin123") {
    return res.json({ success: true });
  } else {
    return res.status(401).json("Invalid admin credentials");
  }
});

module.exports = router;