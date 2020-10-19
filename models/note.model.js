const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  author: { type: String, required: true },
  title: { type: String, required: true },
  file: { type: String, required: true },
  school: { type: String, required: true },
  course: { type: String, required: true },
  professor: { type: String, required: true },
});

/** Model for a User registered in our app */
const Note = model("Note", userSchema);

module.exports = Note;
