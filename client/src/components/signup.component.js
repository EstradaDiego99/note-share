import React, { useState } from "react";
import axios from "axios";
// import bcrypt from "bcryptjs";

export default function SignUp(props) {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const backendURL = "http://localhost:5000";

  const onSubmit = async (e) => {
    e.preventDefault();

    let incompleteForm = false;

    if (!name) {
      incompleteForm = true;
      setNameError(`
        Name field cannot be empty.
      `);
    }

    if (!lastName) {
      incompleteForm = true;
      setNameError(`
        Last name field cannot be empty.
      `);
    }

    if (!email) {
      incompleteForm = true;
      setEmailError(`
        Email field cannot be empty.
      `);
    }

    if (!password) {
      incompleteForm = true;
      setPasswordError(`
        Password field cannot be empty.
      `);
    }

    if (password.length < 8) {
      incompleteForm = true;
      setPasswordError(`
        Password must be 8 characters minimum.
      `);
    }

    if (password !== passwordConfirm) {
      incompleteForm = true;
      setPasswordError(`
        Passwords do not match.
      `);
    }

    if (incompleteForm) return;

    // const passwordHash = await bcrypt.hash(password, 10);

    const newUser = {
      name: name,
      lastName: lastName,
      email: email,
      password: password,
    };

    try {
      await axios.post(`${backendURL}/users/`, newUser);

      const loginForm = {
        email: email,
        password: password,
      };
      const loginResponse = await axios.post(`${backendURL}/login/`, loginForm);
      document.cookie = `note_share_id_token=${loginResponse.data.token}`;
      window.location = "/";
    } catch (error) {
      const { msg, errorCause } = error.response.data;
      if (errorCause && errorCause === "email") {
        setEmailError(msg);
      } else if (errorCause && errorCause === "password") {
        setPasswordError(msg);
      }
    }
  };

  return (
    <div>
      <main>
        <form onSubmit={onSubmit} autoComplete="off">
          <div className="card">
            <div className="card-body">
              <div className="form-group">
                <label>Name: </label>
                <input
                  type="text"
                  autoComplete="nope"
                  className="form-control"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setNameError("");
                  }}
                />
              </div>

              <div className="form-group">
                <label>Last name: </label>
                <input
                  type="text"
                  autoComplete="nope"
                  className="form-control"
                  value={lastName}
                  onChange={(e) => {
                    setLastName(e.target.value);
                    setNameError("");
                  }}
                />
              </div>
              <small className="text-danger">{nameError}</small>

              <div className="form-group">
                <label>Email: </label>
                <input
                  type="text"
                  autoComplete="nope"
                  className="form-control"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError("");
                  }}
                />
              </div>
              <small className="text-danger">{emailError}</small>

              <div className="form-group">
                <label>Password: </label>
                <input
                  type="password"
                  autoComplete="nope"
                  className="form-control"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError("");
                  }}
                />
              </div>

              <div className="form-group">
                <label>Confirm Password: </label>
                <input
                  type="password"
                  autoComplete="nope"
                  className="form-control"
                  value={passwordConfirm}
                  onChange={(e) => {
                    setPasswordConfirm(e.target.value);
                    setPasswordError("");
                  }}
                />
              </div>
              <small className="text-danger">{passwordError}</small>

              <div className="flex-grow-1"></div>

              <input
                type="submit"
                value="Register"
                className="btn btn-primary mt-4"
              />
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
