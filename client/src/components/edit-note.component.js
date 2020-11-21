import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { authenticateUser } from "../utils/auth";
import { backendURL } from "../utils/globals";

export default function EditNote(props) {
  const [currUser, setCurrUser] = useState(undefined);
  const [note, setNote] = useState(undefined);

  const [title, setTitle] = useState("");
  const [file, setFile] = useState(undefined);
  const [newFile, setNewFile] = useState(undefined);
  const [school, setSchool] = useState("");
  const [course, setCourse] = useState("");
  const [professor, setProfessor] = useState("");

  const [titleError, setTitleError] = useState("");
  const [schoolError, setSchoolError] = useState("");
  const [courseError, setCourseError] = useState("");
  const [professorError, setProfessorError] = useState("");

  const { noteID } = useParams();

  const onSubmit = async (e) => {
    e.preventDefault();

    let incompleteForm = false;

    if (!title) {
      incompleteForm = true;
      setTitleError(`
        Title field cannot be empty.
      `);
    }

    if (!school) {
      incompleteForm = true;
      setSchoolError(`
        School field cannot be empty.
      `);
    }

    if (!course) {
      incompleteForm = true;
      setCourseError(`
        Course field cannot be empty.
      `);
    }

    if (!professor) {
      incompleteForm = true;
      setProfessorError(`
        Professor field cannot be empty.
      `);
    }

    if (incompleteForm) return;

    const updatedNote = new FormData();
    updatedNote.append("author", currUser._id);
    updatedNote.append("title", title);
    if (newFile) updatedNote.append("file", newFile);
    updatedNote.append("school", school);
    updatedNote.append("course", course);
    updatedNote.append("professor", professor);

    try {
      await axios.post(`${backendURL}/notes/${noteID}`, updatedNote, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      window.location = `/notes/${noteID}`;
    } catch (error) {
      const { msg } = error.response.data;
      alert(msg);
    }
  };

  useEffect(() => {
    authenticateUser()
      .catch((error) => {
        alert("Current user not logged in");
        window.location = "/";
      })
      .then((cu) => {
        setCurrUser(cu);
        axios
          .get(`${backendURL}/notes/${noteID}`)
          .catch((e) => {
            alert("Note not found");
            window.location = "/";
          })
          .then((resNotes) => {
            const note = resNotes.data;
            setNote(note);
            setTitle(note.title);
            setFile(note.file);
            setSchool(note.school);
            setCourse(note.course);
            setProfessor(note.professor);
            axios
              .get(`${backendURL}/users/${note.author}`)
              .then((resAuthor) => {
                if (resAuthor.data._id !== cu._id) window.location = "/";
              })
              .catch((e) => {
                alert("Author not found");
                window.location = "/";
              });
          });
      });
  }, [noteID]);

  if (!currUser || !note) return <></>;

  return (
    <div className="d-flex min-vh-100 align-items-center">
      <main id="new-note-component" className="container">
        <button
          onClick={() => (window.location = "/")}
          className="btn btn-lg btn-secondary mb-4"
        >
          Back
        </button>
        <form onSubmit={onSubmit} autoComplete="off">
          <div className="card">
            <div className="card-body">
              <div className="form-group">
                <label>Title: </label>
                <input
                  type="text"
                  autoComplete="nope"
                  className="form-control"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    setTitleError("");
                  }}
                />
              </div>
              <small className="text-danger">{titleError}</small>

              <div className="form-group">
                <label>School: </label>
                <input
                  type="text"
                  autoComplete="nope"
                  className="form-control"
                  value={school}
                  onChange={(e) => {
                    setSchool(e.target.value);
                    setSchoolError("");
                  }}
                />
              </div>
              <small className="text-danger">{schoolError}</small>

              <div className="form-group">
                <label>Course: </label>
                <input
                  type="text"
                  autoComplete="nope"
                  className="form-control"
                  value={course}
                  onChange={(e) => {
                    setCourse(e.target.value);
                    setCourseError("");
                  }}
                />
              </div>
              <small className="text-danger">{courseError}</small>

              <div className="form-group">
                <label>Professor: </label>
                <input
                  type="text"
                  autoComplete="nope"
                  className="form-control"
                  value={professor}
                  onChange={(e) => {
                    setProfessor(e.target.value);
                    setProfessorError("");
                  }}
                />
              </div>
              <small className="text-danger">{professorError}</small>

              {!newFile && (
                <small className="text-info">
                  <strong>Previous file: </strong>
                  {file}
                </small>
              )}
              <input
                type="file"
                className="form-control"
                onChange={(e) => setNewFile(e.target.files[0])}
              />
              {newFile && (
                <small className="text-warning">File will be updated</small>
              )}

              <div className="flex-grow-1"></div>

              <div className="container w-100 text-right">
                <input
                  type="submit"
                  value="Update Note"
                  className="btn btn-primary btn-lg mt-4"
                />
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
