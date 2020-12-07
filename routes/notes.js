const router = require("express").Router();
const Note = require("../models/note.model");
const { Storage } = require("@google-cloud/storage");
const Multer = require("multer");

require("dotenv").config();

const storage = new Storage();
const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET);

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 128 * 1024 * 1024, // no larger than 5mb, you can change as needed.
  },
});

// CREATE
router.post("/", multer.single("file"), (req, res, next) => {
  if (!req.file) {
    res.status(400).send("No file uploaded.");
    return;
  }

  const note = req.body;
  const randNum = Math.random().toString(36).substring(2, 15);

  const blob = bucket.file(`${randNum}-${req.file.originalname}`);
  const blobStream = blob.createWriteStream();

  blobStream.on("error", (err) => next(err));
  blobStream.on("finish", () => {
    // The public URL can be used to directly access the file via HTTP.
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
    note.file = publicUrl;
    const newNote = new Note(req.body);
    newNote
      .save()
      .then(() => res.json("New Note registered!"))
      .catch((err) => res.status(400).json(`Error: ${err}`));
  });
  blobStream.end(req.file.buffer);
});

// READ
router.route("/").get((req, res) => {
  Note.find(req.query)
    .then((notes) => res.json(notes))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/:id").get((req, res) => {
  Note.findById(req.params.id)
    .then((note) => res.json(note))
    .catch((err) => res.status(400).json("Error: " + err));
});

// UPDATE
router.post("/:id", multer.single("file"), (req, res, next) => {
  const noteID = req.params.id;
  const updatedNote = req.body;
  const newFile = req.file;

  if (!newFile) {
    Note.findByIdAndUpdate(noteID, updatedNote, {
      returnNewDocument: true,
      new: true,
      strict: false,
    })
      .then(() => res.json("Note has been updated!"))
      .catch((err) => res.status(400).json("Error: " + err));
  } else {
    const randNum = Math.random().toString(36).substring(2, 15);

    const blob = bucket.file(`${randNum}-${newFile.originalname}`);
    const blobStream = blob.createWriteStream();

    blobStream.on("error", (err) => next(err));
    blobStream.on("finish", () => {
      // The public URL can be used to directly access the file via HTTP.
      updatedNote.file = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
      Note.findByIdAndUpdate(noteID, updatedNote, {
        returnNewDocument: true,
        new: true,
        strict: false,
      })
        .then(() => res.json("Note has been updated!"))
        .catch((err) => res.status(400).json("Error: " + err));
    });
    blobStream.end(newFile.buffer);
  }
});

// DELETE
router.route("/:id").delete((req, res) => {
  Note.findByIdAndDelete(req.params.id)
    .then(() => res.json("Note has been removed from the system."))
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
