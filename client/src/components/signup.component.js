import React, { useState } from "react";
import axios from "axios";
import { backendURL } from "../utils/globals";

export default function SignUp(props) {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();

    let incompleteForm = false;

    if (!name) {
      incompleteForm = true;
      setNameError(`Name field cannot be empty.`);
    }

    if (!lastName) {
      incompleteForm = true;
      setNameError(`Last name field cannot be empty.`);
    }

    if (!email) {
      incompleteForm = true;
      setEmailError(`Email field cannot be empty.`);
    }

    if (!password) {
      incompleteForm = true;
      setPasswordError(`Password field cannot be empty.`);
    }

    if (password.length < 8) {
      incompleteForm = true;
      setPasswordError(`Password must be 8 characters minimum.`);
    }

    if (password !== passwordConfirm) {
      incompleteForm = true;
      setPasswordError(`Passwords do not match.`);
    }

    if (incompleteForm) return;

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
      alert(msg);
      if (errorCause && errorCause === "email") {
        setEmailError(msg);
      } else if (errorCause && errorCause === "password") {
        setPasswordError(msg);
      }
    }
  };

  return (
    <div className="d-flex min-vh-100 align-items-center">
      <main id="signup-component" className="container text-center">
        <div className="row justify-content-center align-items-center flex-column">
          <h1 class="h3 mb-3 font-weight-normal">Sign Up</h1>
          <form
            onSubmit={onSubmit}
            autoComplete="off"
            className="card form-group"
          >
            <div className="card-body">
              <div className="input-group mb-1">
                <div class="input-group-prepend">
                  <div class="input-group-text">
                    <span class="material-icons">person</span>
                  </div>
                </div>
                <input
                  type="text"
                  autoComplete="nope"
                  className="form-control"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setNameError("");
                  }}
                />
              </div>

              <div className="input-group mb-4">
                <div class="input-group-prepend">
                  <div class="input-group-text">
                    <span class="material-icons">people_alt</span>
                  </div>
                </div>
                <input
                  type="text"
                  autoComplete="nope"
                  className="form-control"
                  placeholder="Last name"
                  value={lastName}
                  onChange={(e) => {
                    setLastName(e.target.value);
                    setNameError("");
                  }}
                />
              </div>
              <small className="text-danger">{nameError}</small>

              <div className="input-group mb-2">
                <div class="input-group-prepend">
                  <div class="input-group-text">
                    <span class="material-icons">email</span>
                  </div>
                </div>
                <input
                  type="text"
                  autoComplete="nope"
                  className="form-control"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError("");
                  }}
                />
              </div>
              <small className="text-danger">{emailError}</small>

              <div className="input-group mb-1">
                <div class="input-group-prepend">
                  <div class="input-group-text">
                    <span class="material-icons">vpn_key</span>
                  </div>
                </div>
                <input
                  type="password"
                  autoComplete="nope"
                  className="form-control"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError("");
                  }}
                />
              </div>

              <div className="input-group mb-3">
                <div class="input-group-prepend">
                  <div class="input-group-text">
                    <span class="material-icons">vpn_key</span>
                  </div>
                </div>
                <input
                  type="password"
                  autoComplete="nope"
                  className="form-control"
                  placeholder="Confirm password"
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
                className="btn btn-lg btn-primary btn-block mt-4"
              />
              <a href="/login" className="btn btn-sm btn-secondary btn-block">
                Log In
              </a>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
