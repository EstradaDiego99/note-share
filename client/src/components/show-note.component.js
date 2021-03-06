import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import FileViewer from "react-file-viewer";
import { backendURL } from "../utils/globals";
import { authenticateUser } from "../utils/auth";

export default function NoteShow(props) {
  const [currUser, setCurrUser] = useState(undefined);
  const [note, setNote] = useState(undefined);
  const [author, setAuthor] = useState(undefined);

  const { noteID } = useParams();

  const deleteNote = async () => {
    try {
      alert("This note will be permanently deleted");
      await axios.delete(`${backendURL}/notes/${noteID}`);
      window.location = "/";
    } catch (error) {
      alert("Note not found");
      window.location = "/";
    }
  };

  useEffect(() => {
    authenticateUser()
      .then((cu) => setCurrUser(cu))
      .catch((error) => console.log(error));
    axios
      .get(`${backendURL}/notes/${noteID}`)
      .then((resNotes) => {
        const note = resNotes.data;
        note.type = note.file.substr(note.file.lastIndexOf(".") + 1);
        setNote(note);
        axios
          .get(`${backendURL}/users/${note.author}`)
          .then((resUser) => setAuthor(resUser.data))
          .catch((e) => alert("Author not found"));
      })
      .catch((e) => { });
  }, [noteID]);

  if (!note || !author) return <></>;

  return (
    <div className="d-flex min-vh-100 ">
      <main id="new-note-component" className="container">
        <div className="row mt-3">
          <div className="col-12 col-md-6 mt-4 note-info d-flex flex-column">
            <h1 className="h1">{note.title}</h1>
            <h3 className="text-secondary mb-4 h3 author-label">
              <button
                onClick={() => {
                  window.location = `/users/${note.author}`;
                }}
                className="btn btn-md btn-primary mr-3"
              >
                <span className="material-icons">person</span>
              </button>
              {author.name} {author.lastName}
            </h3>
            <p className="mb-3">
              <span className="material-icons mr-2">school</span>
              {note.school}
            </p>
            <p className="mb-3">
              <span className="material-icons mr-2">video_label</span>
              {note.course}
            </p>
            <p className="mb-3">
              <span className="material-icons mr-2">assignment_ind</span>
              {note.professor}
            </p>
            <div className="flex-grow-1"></div>
            <div className="d-flex mt-5">
              <a
                href={note.file}
                className="btn btn-lg flex-grow-1 btn-primary"
                target="blank"
              >
                <span className="material-icons mr-2">get_app</span>
                Download file
              </a>
              {currUser && author._id === currUser._id && (
                <>
                  <button
                    onClick={() => {
                      window.location = `/edit_note/${note._id}`;
                    }}
                    className="btn btn-lg btn-secondary ml-3"
                    target="blank"
                  >
                    <span className="material-icons">edit</span>
                  </button>
                  <button
                    onClick={deleteNote}
                    className="btn btn-lg btn-danger ml-3"
                    target="blank"
                  >
                    <span className="material-icons">delete</span>
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="col-12 col-md-6 file-container mt-4">
            <FileViewer
              fileType={note.type}
              filePath={`https://cors-anywhere.herokuapp.com/${note.file}`}
            />
          </div>
        </div>

        <div className="text-right mt-4 mb-4">
          <button
            onClick={() => (window.location = "/")}
            className="btn btn-lg btn-secondary"
          >
            Back
          </button>
        </div>
      </main>
    </div>
  );
}
