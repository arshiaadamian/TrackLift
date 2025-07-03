import React from "react";
import { Link } from "react-router-dom";
import "../style/navbar.css";

export default function Navbar() {
  return (
    <div id="navbar">
      <nav>
        <ul>
          <li>
            <Link to="/myPlan">My plan</Link>
          </li>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/calendar">Today</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
