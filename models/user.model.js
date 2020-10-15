const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  name: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

/** Model for a User registered in our app */
const User = model("User", userSchema);

module.exports = { User, userSchema };
