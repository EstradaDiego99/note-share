import React, { useState, useEffect } from "react";
import axios from "axios";
import { backendURL, stringsMatch } from "../utils/globals";
import { authenticateUser } from "../utils/auth";

export default function NewNote(props) {
  const [currUser, setCurrUser] = useState(undefined);

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

  const [notes, setNotes] = useState("");
  const [schoolSuggestions, setSchoolSuggestions] = useState([]);
  const [courseSuggestions, setCourseSuggestions] = useState([]);
  const [professorSuggestions, setProfessorSuggestions] = useState([]);

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

    const newNote = new FormData();
    newNote.append("author", currUser._id);
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
    authenticateUser()
      .then((cu) => setCurrUser(cu))
      .catch((e) => {
        alert("User must be logged in to submit notes");
        window.location = "/login";
      });
    axios
      .get(`${backendURL}/notes/`)
      .then((resNotes) => setNotes(resNotes.data))
      .catch((error) => alert(JSON.stringify(error)));
  }, []);

  useEffect(() => {
    const updateSuggestions = () => {
      let auxSuggestions;

      auxSuggestions = new Set();
      for (const note of notes) {
        if (course && note.course !== course) continue;
        if (professor && note.professor !== professor) continue;
        if (!stringsMatch(note.school, school)) continue;
        auxSuggestions.add(note.school);
      }
      setSchoolSuggestions(Array.from(auxSuggestions));

      auxSuggestions = new Set();
      for (const note of notes) {
        if (school && note.school !== school) continue;
        if (professor && note.professor !== professor) continue;
        if (!stringsMatch(note.course, course)) continue;
        auxSuggestions.add(note.course);
      }
      setCourseSuggestions(Array.from(auxSuggestions));

      auxSuggestions = new Set();
      for (const note of notes) {
        if (school && note.school !== school) continue;
        if (course && note.course !== course) continue;
        if (!stringsMatch(note.professor, professor)) continue;
        auxSuggestions.add(note.professor);
      }
      setProfessorSuggestions(Array.from(auxSuggestions));
    };

    updateSuggestions();
  }, [notes, school, course, professor]);

  if (!currUser) return <></>;

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

              <div id="school-input" className="form-group">
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
                <div className="suggestions-container">
                  <ul className="list-group">
                    {schoolSuggestions.map((suggestion) => {
                      return (
                        <li
                          key={suggestion}
                          className="list-group-item"
                          onMouseDown={() => setSchool(suggestion)}
                        >
                          {suggestion}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
              <small className="text-danger">{schoolError}</small>

              <div id="course-input" className="form-group">
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
                <div className="suggestions-container">
                  <ul className="list-group">
                    {courseSuggestions.map((suggestion) => {
                      return (
                        <li
                          key={suggestion}
                          className="list-group-item"
                          onMouseDown={() => setCourse(suggestion)}
                        >
                          {suggestion}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
              <small className="text-danger">{courseError}</small>

              <div id="professor-input" className="form-group">
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
                <div className="suggestions-container">
                  <ul className="list-group">
                    {professorSuggestions.map((suggestion) => {
                      return (
                        <li
                          key={suggestion}
                          className="list-group-item"
                          onMouseDown={() => setProfessor(suggestion)}
                        >
                          {suggestion}
                        </li>
                      );
                    })}
                  </ul>
                </div>
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
