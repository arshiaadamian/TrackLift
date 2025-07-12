import React from "react";
import "../style/login.css";
import { Link, useLocation } from "react-router-dom";
import logo from "../images/logo.png";

function Login() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const error = params.get("error");

  return (
    <div className="body">
      <form className="form-signin" action="/api/loggingin" method="POST">
        <img className="mb-4" src={logo} alt="logo" width="140" height="140" />
        <h1 className="h3 mb-3 font-weight-normal">Sign in</h1>
        <label htmlFor="inputEmail" className="sr-only"></label>
        <input
          type="email"
          id="inputEmail"
          className="form-control"
          placeholder="Email address"
          required=""
          autoFocus=""
          name="username"
        />
        <label htmlFor="inputPassword" className="sr-only"></label>
        <input
          type="password"
          id="inputPassword"
          className="form-control"
          placeholder="Password"
          required=""
          name="password"
        />

        <button className="btn btn-lg btn-primary btn-block" type="submit">
          Sign in
        </button>
        <div className="error-message">
          {error === "user_not_exist" && (
            <p style={{ color: "red" }} className="error">
              user does not exist
            </p>
          )}
          {error === "incorrect_password" && (
            <p style={{ color: "red" }} className="error">
              incorrect password
            </p>
          )}
        </div>
        <Link to="/signup" className="signup-link">
          Don't have an account? click here to sign up
        </Link>
        <p className="mt-5 mb-3 text-muted">
          All rights reserved to the author, Arshia Adamian.
        </p>
      </form>
    </div>
  );
}

export default Login;
