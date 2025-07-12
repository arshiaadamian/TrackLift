import React, { useState } from "react";
import "../style/login.css";
import { Link, useNavigate } from "react-router-dom";
import logo from "../images/logo.png";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);

    try {
      const res = await fetch(
        "https://tracklift-server.onrender.com/loggingin",
        {
          method: "POST",
          body: formData,
          credentials: "include",
        }
      );

      if (res.ok) {
        navigate("/");
      } else {
        const data = await res.json();
        setError(data.error);
      }
    } catch (err) {
      setError("Something went wrong. Try again.");
    }
  };

  return (
    <div className="body">
      <form className="form-signin" onSubmit={handleLogin}>
        <img className="mb-4" src={logo} alt="logo" width="140" height="140" />
        <h1 className="h3 mb-3 font-weight-normal">Sign in</h1>

        <input
          type="email"
          className="form-control"
          placeholder="Email address"
          required
          autoFocus
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          className="form-control"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="btn btn-lg btn-primary btn-block" type="submit">
          Sign in
        </button>

        <div className="error-message" style={{ color: "red" }}>
          {error === "user_not_exist" && <p>User does not exist</p>}
          {error === "incorrect_password" && <p>Incorrect password</p>}
          {error &&
            error !== "user_not_exist" &&
            error !== "incorrect_password" && <p>{error}</p>}
        </div>

        <Link to="/signup" className="signup-link">
          Don't have an account? Click here to sign up
        </Link>

        <p className="mt-5 mb-3 text-muted">
          All rights reserved to the author, Arshia Adamian.
        </p>
      </form>
    </div>
  );
}

export default Login;
