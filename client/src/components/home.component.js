import React, { useState, useEffect } from "react";
import axios from "axios";
import NoteSummary from "./note-summary.component";
import { backendURL, stringsMatch } from "../utils/globals";
import { authenticateUser, logout } from "../utils/auth";

export default function Home() {
  const [currUser, setCurrUser] = useState(undefined);
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);

  const [school, setSchool] = useState("");
  const [course, setCourse] = useState("");
  const [professor, setProfessor] = useState("");

  useEffect(() => {
    authenticateUser()
      .then((u) => setCurrUser(u))
      .catch((e) => console.log(e));
    axios
      .get(`${backendURL}/notes/`)
      .then((resNotes) => setNotes(resNotes.data))
      .catch((error) => alert("Notes not found"));
  }, []);

  useEffect(() => {
    const fNotes = notes.filter((n) => {
      if (!stringsMatch(n.school, school)) return false;
      if (!stringsMatch(n.course, course)) return false;
      if (!stringsMatch(n.professor, professor)) return false;
      return true;
    });
    setFilteredNotes(fNotes);
  }, [notes, school, course, professor]);

  return (
    <div>
      <div className="jumbotron text-center">
        <h1 className="text-center mt-4 mb-4">
          Hello{currUser ? ` ${currUser.name}` : ""}!! Welcome to the HOME
          page!!
        </h1>
        {currUser && (
          <button onClick={logout} className="btn btn-lg btn-danger">
            <span className="material-icons">exit_to_app</span> Log out
          </button>
        )}
        {!currUser && (
          <button
            onClick={() => (window.location = "/login")}
            className="btn btn-lg btn-info"
          >
            <span className="material-icons">login</span> Log in
          </button>
        )}
        <div className="container mt-4">
          <input
            type="text"
            autoComplete="nope"
            className="form-control home-query"
            placeholder="Seach for school"
            value={school}
            onChange={(e) => setSchool(e.target.value)}
          />
          <input
            type="text"
            autoComplete="nope"
            className="form-control home-query"
            placeholder="Seach for course"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
          />
          <input
            type="text"
            autoComplete="nope"
            className="form-control home-query"
            placeholder="Seach for professor"
            value={professor}
            onChange={(e) => setProfessor(e.target.value)}
          />
        </div>
      </div>
      <div className="container">
        <div className="row">
          {filteredNotes.map((note) => (
            <NoteSummary note={note} key={note._id} />
          ))}
        </div>
      </div>
      {currUser && (
        <div className="container text-right mb-4">
          <button
            className="btn btn-lg btn-primary"
            onClick={() => (window.location = "/new_note")}
          >
            <span className="material-icons">add_box</span> New note
          </button>
        </div>
      )}
    </div>
  );
}
