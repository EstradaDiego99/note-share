const router = require("express").Router();
const bcrypt = require("bcrypt");
const { User } = require("../models/user.model");

// CREATE
router.route("/").post(async (req, res) => {
  req.body.password = await bcrypt.hash(req.body.password, 10);
  const newUser = new User(req.body);
  newUser
    .save()
    .catch((err) => {
      const response = {
        backendError: err,
        msg: "There has been an error creating the user.",
      };
      if (err.code === 11000) {
        const repeatedKey = Object.keys(err.keyValue)[0];
        response.msg = `There is already a registered account with this ${repeatedKey}`;
        response.errorCause = repeatedKey;
      }
      res.status(400).json(response);
    })
    .then(() => res.json("New User registered!"));
});

// READ
router.route("/").get((req, res) => {
  User.find()
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/:id").get((req, res) => {
  User.findById(req.params.id)
    .then((user) => res.json(user))
    .catch((err) => res.status(400).json("Error: " + err));
});

// UPDATE
router.route("/:id").post((req, res) => {
  User.findByIdAndUpdate(req.params.id, req.body, {
    returnNewDocument: true,
    new: true,
    strict: false,
  })
    .then(() => res.json("User has been updated!"))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/:id").delete((req, res) => {
  User.findByIdAndDelete(req.params.id)
    .then(() => res.json("User has been removed from the system."))
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
