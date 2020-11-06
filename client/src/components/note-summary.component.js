import React from "react";

export default function NoteSummary(props) {
  return (
    <div
      className="col-md-4 mb-4 note-summary"
      onClick={() => {
        window.location = `/notes/${props.note._id}`;
      }}
    >
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
            <strong>{props.note.title}</strong>
          </p>
          <p className="mb-2 pl-2" style={{ lineHeight: 1 }}>
            {props.note.course}
          </p>
          <small
            className="mb-2 d-block pl-2 text-secondary"
            style={{ lineHeight: 1 }}
          >
            {props.note.professor}
          </small>
          <small
            className="mb-2 d-block pl-2 text-secondary"
            style={{ lineHeight: 1 }}
          >
            {props.note.school}
          </small>
        </div>
      </div>
    </div>
  );
}
