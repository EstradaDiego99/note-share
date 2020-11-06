import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { backendURL } from "../globals";

export default function NewNote(props) {
  const [user, setUser] = useState(undefined);

  const [title, setTitle] = useState("");
  const [file, setFile] = useState(undefined);
  const [school, setSchool] = useState("");
  const [course, setCourse] = useState("");
  const [professor, setProfessor] = useState("");

  const [titleError, setTitleError] = useState("");
  const [fileError, setFileError] = useState("");
  const [schoolError, setSchoolError] = useState("");
  const [courseError, setCourseError] = useState("");
  const [professorError, setProfessorError] = useState("");

  const authenticateUser = async () => {
    try {
      const authResponse = await axios.post(`${backendURL}/authenticate/`, {
        token: Cookies.get("note_share_id_token"),
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
      alert(error);
      window.location = "/login";
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    let incompleteForm = false;

    if (!title) {
      incompleteForm = true;
      setTitleError(`
        Title field cannot be empty.
      `);
    }

    if (!file) {
      incompleteForm = true;
      setFileError(`
        File field cannot be empty.
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

    // const passwordHash = await bcrypt.hash(password, 10);
    const newNote = new FormData();
    newNote.append("author", user._id);
    newNote.append("title", title);
    newNote.append("file", file);
    newNote.append("school", school);
    newNote.append("course", course);
    newNote.append("professor", professor);

    try {
      await axios.post(`${backendURL}/notes/`, newNote, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      window.location = "/";
    } catch (error) {
      const { msg } = error.response.data;
      alert(msg);
    }
  };

  useEffect(() => {
    authenticateUser();
  }, []);

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

              <input
                type="file"
                className="form-control"
                onChange={(e) => {
                  setFile(e.target.files[0]);
                  setFileError("");
                }}
              />
              <small className="text-danger">{fileError}</small>

              <div className="flex-grow-1"></div>

              <div className="container w-100 text-right">
                <input
                  type="submit"
                  value="Upload Note"
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
