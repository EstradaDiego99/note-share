import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

export default function Home() {
  const [user, setUser] = useState(undefined);
  const [notes, setNotes] = useState([]);

  const backendURL = "http://localhost:5000";

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
      window.location = "/login";
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

  const notesDisplay = notes.map((note) => (
    <div>
      <p>{note.title}</p>
      <p>{note.school}</p>
      <p>{note.course}</p>
      <p>{note.professor}</p>
      <a target="blank" href={note.file}>
        File
      </a>
    </div>
  ));

  useEffect(() => {
    authenticateUser();
    loadNotes();
  }, []);

  return (
    <div>
      {user && (
        <>
          <h1>Hello {user.name}!! Welcome to the HOME page!!</h1>
          <button onClick={logout}>Log out</button>
          <button
            onClick={() => {
              window.location = "/new_note";
            }}
          >
            New note
          </button>
          {notesDisplay}
        </>
      )}
    </div>
  );
}
