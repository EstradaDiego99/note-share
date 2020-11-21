import React, { useState, useEffect } from "react";
import axios from "axios";
import NoteSummary from "./note-summary.component";
import { backendURL } from "../utils/globals";
import { authenticateUser, logout } from "../utils/auth";

export default function Home() {
  const [user, setUser] = useState(undefined);
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    authenticateUser()
      .then((u) => setUser(u))
      .catch((e) => {
        console.log(e);
      });
    axios
      .get(`${backendURL}/notes/`)
      .then((resNotes) => setNotes(resNotes.data))
      .catch((error) => alert("Notes not found"));
  }, []);

  return (
    <div>
      <div className="jumbotron text-center">
        <h1 className="text-center mt-4 mb-4">
          Hello{user ? ` ${user.name}` : ""}!! Welcome to the HOME page!!
        </h1>
        {user && (
          <button onClick={logout} className="btn btn-lg btn-danger">
            <span className="material-icons">exit_to_app</span> Log out
          </button>
        )}
        {!user && (
          <button
            onClick={() => (window.location = "/login")}
            className="btn btn-lg btn-info"
          >
            <span className="material-icons">login</span> Log in
          </button>
        )}
      </div>
      <div className="container">
        <div className="row">
          {notes.map((note) => (
            <NoteSummary note={note} key={note._id} />
          ))}
        </div>
      </div>
      {user && (
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
