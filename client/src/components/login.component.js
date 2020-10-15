import React, { useState } from "react";
import axios from "axios";

export default function LogIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const backendURL = "http://localhost:5000";

  const login = async (e) => {
    e.preventDefault();

    if (!email) {
      setEmailError(`
        Please introduce your email.
      `);
    }

    if (!password) {
      setPasswordError(`
        Please introduce your password.
      `);
    }

    if (!email || !password) {
      return;
    }

    const loginForm = {
      email: email,
      password: password,
    };

    try {
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
      return;
    }
  };

  return (
    <div>
      <main id="inicio-sesion-component">
        <form onSubmit={login} autoComplete="off" className="card">
          <div className="card-body">
            <div className="form-group">
              <label>Email: </label>
              <input
                autoComplete="nope"
                className="form-control"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError("");
                }}
              />
              <small className="text-danger">{emailError}</small>
            </div>

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
              <small className="text-danger">{passwordError}</small>
            </div>

            <div className="flex-grow-1"></div>

            <input
              type="submit"
              value="Log In"
              className="btn btn-primary mt-4"
            />
            <a href="/signup" className="btn">
              Sign Up
            </a>
          </div>
        </form>
      </main>
    </div>
  );
}
