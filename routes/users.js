const router = require("express").Router();
const { User } = require("../models/user.model");

// CREATE
router.route("/").post((req, res) => {
  const newUser = new User(req.body);
  newUser
    .save()
    .then(() => res.json("New User registered!"))
    .catch((err) => res.status(400).json(`Error: ${err}`));
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
