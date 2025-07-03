import React, { useState, useEffect } from "react";
import Navbar from "../components/navbar";

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
  return (
    <div>
      <div>
        <h1>Home Page</h1>

        <h2>Hello {userName !== "none" && userName}</h2>
        <h3>Exercises</h3>
        <ul>
          {exercises.length > 0 ? (
            exercises.map((exercise, index) => (
              <li key={index}>
                {exercise.name} - {exercise.tutorial}
              </li>
            ))
          ) : (
            <p>No exercises available</p>
          )}
        </ul>
      </div>
      {<Navbar />}
    </div>
  );
}

export default Home;
