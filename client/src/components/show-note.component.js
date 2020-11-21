import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import FileViewer from "react-file-viewer";
import { backendURL } from "../globals";

export default function ShowNote(props) {
  const [user, setUser] = useState(undefined);
  const [note, setNote] = useState(undefined);
  const [author, setAuthor] = useState(undefined);

  const { noteID } = useParams();

  const authenticateUser = async () => {
    const authToken = Cookies.get("note_share_id_token");
    if (!authToken) return;
    try {
      const authResponse = await axios.post(`${backendURL}/authenticate/`, {
        token: authToken,
      });
      const loggedID = authResponse.data.jwtVerification._id;
      const loggedUser = await axios.get(`${backendURL}/users/${loggedID}`);
      if (!loggedUser.data) {
        const error = new Error();
        error.response = { status: 410 };
        throw error;
      }
      setUser(loggedUser.data);
    } catch (error) {
      window.location = "/login";
    }
  };

  const loadNote = async () => {
    try {
      const resNotes = await axios.get(`${backendURL}/notes/${noteID}`);
      const note = resNotes.data;
      note.type = note.file.substr(note.file.lastIndexOf(".") + 1);
      setNote(note);
      return note;
    } catch (error) {
      console.log("Note not found");
      window.location = "/";
    }
  };

  const loadAuthor = async (authorID) => {
    try {
      const resUser = await axios.get(`${backendURL}/users/${authorID}`);
      setAuthor(resUser.data);
    } catch (error) {
      console.log("Author not found");
    }
  };

  const deleteNote = async () => {
    try {
      alert("This note will be permanently deleted");
      await axios.delete(`${backendURL}/notes/${noteID}`);
      window.location = "/";
    } catch (error) {
      console.log("Author not found");
      window.location = "/";
    }
  };

  useEffect(() => {
    authenticateUser();
    loadNote();
  }, []);

  useEffect(() => {
    if (note) loadAuthor(note.author);
  }, [note]);

  return (
    <div className="d-flex min-vh-100 ">
      <main id="new-note-component" className="container">
        {note && author && (
          <>
            <div className="row mt-3">
              <div className="col-12 col-md-6 mt-4 note-info d-flex flex-column">
                <h1 className="h1">{note.title}</h1>
                <h3 className="text-secondary ml-4 mb-4 h3">
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
                  {user && author._id === user._id && (
                    <button
                      onClick={() => {
                        window.location = `/edit_note/${note._id}`;
                      }}
                      className="btn btn-lg btn-secondary mr-3"
                      target="blank"
                    >
                      <span className="material-icons">edit</span>
                    </button>
                  )}
                  <a
                    href={note.file}
                    className="btn btn-lg flex-grow-1 btn-primary"
                    target="blank"
                  >
                    <span className="material-icons mr-2">get_app</span>
                    Download file
                  </a>
                  {user && author._id === user._id && (
                    <button
                      onClick={deleteNote}
                      className="btn btn-lg btn-danger ml-3"
                      target="blank"
                    >
                      <span className="material-icons">delete</span>
                    </button>
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
          </>
        )}
      </main>
    </div>
  );
}
