import React from "react";

export default function NoteSummary(props) {
  return (
    <div className="col-md-4 mb-4">
      <div className="card box-shadow">
        <div className="card-img-top text-center bg-secondary">
          <a target="blank" href={props.note.file}>
            <span className="material-icons p-5 h1 text-light">
              insert_drive_file
            </span>
          </a>
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
