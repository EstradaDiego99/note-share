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
    <div className="d-flex min-vh-100 align-items-center">
      <main id="login-component" className="container text-center">
        <div className="row justify-content-center align-items-center flex-column">
          <h1 class="h3 mb-3 font-weight-normal">Please sign in</h1>
          <form onSubmit={login} autoComplete="off" className="card form-group">
            <div className="card-body">
              <div className="input-group mb-3">
                <div class="input-group-prepend">
                  <div class="input-group-text">
                    <span class="material-icons">email</span>
                  </div>
                </div>
                <input
                  autoComplete="nope"
                  className="form-control"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError("");
                  }}
                />
                <small className="text-danger">{emailError}</small>
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
                  placeholder="Password"
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
                className="btn btn-lg btn-primary btn-block mt-4"
              />
              <a href="/signup" className="btn btn-sm btn-secondary btn-block">
                Sign Up
              </a>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
