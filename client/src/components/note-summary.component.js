import React from "react";
import { Link } from "react-router-dom";

export default function NoteSummary(props) {
  const { note } = props;

  return (
    <Link to={`/notes/${note._id}`} className="col-md-4 mb-4">
      <div className="card box-shadow">
        <div className="card-img-top text-center bg-secondary">
          <span
            className="material-icons p-5 h1 text-light"
            style={{ fontSize: "2em" }}
          >
            insert_drive_file
          </span>
        </div>

        <div className="card-body">
          <p className="mb-3" style={{ lineHeight: 1 }}>
            <strong>{note.title}</strong>
          </p>
          <p className="mb-2 pl-2" style={{ lineHeight: 1 }}>
            {note.course}
          </p>
          <small
            className="mb-2 d-block pl-2 text-secondary"
            style={{ lineHeight: 1 }}
          >
            {note.professor}
          </small>
          <small
            className="mb-2 d-block pl-2 text-secondary"
            style={{ lineHeight: 1 }}
          >
            {note.school}
          </small>
        </div>
      </div>
    </Link>
  );
}
