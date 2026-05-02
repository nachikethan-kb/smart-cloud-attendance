const router = require("express").Router();
const Face = require("../models/Face");

// 🔹 Register face
router.post("/", async (req, res) => {
  const { name, descriptor } = req.body;

  try {
    let user = await Face.findOne({ name });

    if (!user) {
      user = new Face({
        name,
        descriptors: [descriptor]
      });
    } else {
      user.descriptors.push(descriptor);
    }

    await user.save();

    res.json("Face saved");
  } catch (err) {
    res.status(500).json("Error saving face");
  }
});

// 🔹 Get all faces
router.get("/", async (req, res) => {
  const data = await Face.find();
  res.json(data);
});

module.exports = router;