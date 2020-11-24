const router = require("express").Router();
const bcrypt = require("bcrypt");
const { User } = require("../models/user.model");
const jwt = require("jsonwebtoken");

router.route("/").post(async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ msg: "Incomplete fields." });

    let user = await User.findOne({ email: email });
    if (!user)
      return res.status(400).json({
        msg: "No user registered with this email.",
        errorCause: "email",
      });

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch && password !== user.password)
      return res
        .status(400)
        .json({ msg: "Incorrect password.", errorCause: "Password" });

    const token = jwt.sign(
      { _id: user._id.toString() },
      process.env.JWT_SECRET,
      {
        expiresIn: "1y",
      }
    );
    res.json({
      token: token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
