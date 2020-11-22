import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { backendURL } from "../utils/globals";
import NoteSummary from "./note-summary.component";

export default function UserShow(props) {
  const [user, setUser] = useState(undefined);
  const [notes, setNotes] = useState([]);

  const { userID } = useParams();

  const padNumber = (number) =>
    number <= 99 ? `0${number}`.slice(-2) : number;

  useEffect(() => {
    axios
      .get(`${backendURL}/users/${userID}`)
      .then((resUser) => setUser(resUser.data))
      .catch((e) => alert("User not found"));
    axios
      .get(`${backendURL}/notes`, { params: { author: userID } })
      .then((resNotes) => setNotes(resNotes.data))
      .catch((e) => alert("Notes not found"));
  }, [userID]);

  if (!user) return <></>;

  return (
    <div className="d-flex min-vh-100 ">
      <main id="user-show-component" className="container">
        <div className="jumbotron text-center">
          <button
            onClick={() => (window.location = "/")}
            className="btn btn-lg btn-secondary mt-3"
          >
            <span className="material-icons">home</span> Home
          </button>
          <h1 className="text-center mt-4 mb-4">
            {user.name} {user.lastName}
          </h1>
          <h3 className="text-center">{padNumber(notes.length)} notes</h3>
        </div>
        <div className="container">
          <div className="row">
            {notes.map((note) => (
              <NoteSummary note={note} key={note._id} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
