import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

function Signup() {
  const location = useLocation(); // useLocation is a hook from react-router-dom that gives access to the current location object
  const params = new URLSearchParams(location.search); // creates a URLSearchParams object from the query string
  const error = params.get("error");

  return (
    <div className="authentication">
      <h1>Sign up</h1>
      <form action="submitUser" method="POST">
        <div className="form-group">
          <label for="exampleInputEmail1">Email address</label>
          <input
            type="email"
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            placeholder="Enter email"
            name="username"
          />
          <small id="emailHelp" className="form-text text-muted">
            We'll never share your email with anyone else.
          </small>
        </div>
        <div className="form-group">
          <label for="exampleInputPassword1">Password</label>
          <input
            type="password"
            className="form-control"
            id="exampleInputPassword1"
            placeholder="Password"
            name="password"
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Sing up
        </button>
      </form>
      <a href="/login">
        <button className="btn btn-primary">
          already have an accout? login
        </button>
      </a>
      <div className="user-exists">
        {error === "user_exists" && (
          <p style={{ color: "red" }}>User already exists</p>
        )}
      </div>
    </div>
  );
}

export default Signup;
