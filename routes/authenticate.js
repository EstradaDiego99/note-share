const router = require("express").Router();
const jwt = require("jsonwebtoken");

require("dotenv").config();

router.route("/").post(async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      res.status(410).json({ msg: "Token not received." });
      return;
    }

    const jwtVerification = await jwt.verify(token, process.env.JWT_SECRET);
    res.json({ jwtVerification: jwtVerification });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
