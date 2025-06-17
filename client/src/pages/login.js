import React from "react";
import "../style/login.css";
import { useLocation } from "react-router-dom";

function Login() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const error = params.get("error");

  return (
    <div className="body">
      <form className="form-signin" action="/loggingin" method="POST">
        <img
          className="mb-4"
          src="https://getbootstrap.com/docs/4.0/assets/brand/bootstrap-solid.svg"
          alt=""
          width="72"
          height="72"
        />
        <h1 className="h3 mb-3 font-weight-normal">Please sign in</h1>
        <label htmlFor="inputEmail" className="sr-only">
          Email address
        </label>
        <input
          type="email"
          id="inputEmail"
          className="form-control"
          placeholder="Email address"
          required=""
          autoFocus=""
          name="username"
        />
        <label htmlFor="inputPassword" className="sr-only">
          Password
        </label>
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
            <p style={{ color: "red" }}>user does not exist</p>
          )}
          {error === "incorrect_password" && (
            <p style={{ color: "red" }}>incorrect password</p>
          )}
        </div>
        <p className="mt-5 mb-3 text-muted">© 2017-2018</p>
      </form>
    </div>
  );
}

export default Login;
