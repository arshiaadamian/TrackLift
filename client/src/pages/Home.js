import React, { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import "../style/home.css";
import filterExercise from "../utils/filterExercise.js";

function Home() {
  const [userName, setUserName] = useState("none");
  useEffect(() => {
    // fetch the username from the server
    console.log("fetching username from server");
    fetch("/api/user")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setUserName(data.username);
      });
  }, []);

  const [exercises, setExercises] = useState([]);
  useEffect(() => {
    fetch("/api/exercises")
      .then((res) => res.json())
      .then((data) => {
        setExercises(data);
        console.log("exercises fetched from server", data);
      });
  }, []);

  // get the searched exercises
  const [searchQuery, setSearchQuery] = useState("");
  const searchedExercises = filterExercise(exercises, searchQuery);

  return (
    <div>
      <div className="home-page">
        <h1>Home Page</h1>
        <h2>Hi {userName !== "none" && userName}</h2>
        <div className="search-bar">
          <nav className="navbar navbar-light bg-light">
            <form className="form-inline" onSubmit={(e) => e.preventDefault()}>
              <input
                className="form-control mr-sm-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                className="btn btn-outline-success my-2 my-sm-0"
                type="submit"
              >
                Search
              </button>
            </form>
          </nav>
        </div>
        <h3>Exercises</h3>
        <p>Click on any exercises to see tutorial.</p>
        <div>
          {/* searched exercises */}
          {Object.entries(searchedExercises).map(([category, exerciseList]) => (
            <div key={category}>
              <h4>{category}</h4>
              <ul>
                {exerciseList.map((exercise, idx) => (
                  <li key={idx}>
                    <a
                      href={exercise.tutorial}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {exercise.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      {<Navbar />}
    </div>
  );
}

export default Home;
