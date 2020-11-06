import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import NoteSummary from "./note-summary.component";
import { backendURL } from "../globals";

export default function Home() {
  const [user, setUser] = useState(undefined);
  const [notes, setNotes] = useState([]);

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
      console.log(error);
    }
  };

  const loadNotes = async () => {
    try {
      const resNotes = await axios.get(`${backendURL}/notes/`);
      setNotes(resNotes.data);
    } catch (error) {
      console.log("Notes not found");
    }
  };

  const logout = () => {
    Cookies.remove("note_share_id_token");
    window.location = "/login";
  };

  useEffect(() => {
    authenticateUser();
    loadNotes();
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
