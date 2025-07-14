import React, { useEffect, useState } from "react";
import Navbar from "../components/navbar.js";
import "../style/calendar.css";

export default function Calendar() {
  const now = new Date();
  const dayIndex = now.getDay();
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const currentDay = daysOfWeek[dayIndex];

  const [workouts, setWorkouts] = useState([]);
  const API_URL = process.env.REACT_APP_API_URL || "";
  console.log("API_URL", API_URL);
  useEffect(() => {
    fetch(`${API_URL}/api/user`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setWorkouts(
          data[currentDay].exercises || ["No workouts scheduled for today"]
        );
      });
  }, [currentDay]);
  return (
    <div className="calendar-page">
      <h1>{currentDay}</h1>

      <div className="workouts">
        <h3>Workouts</h3>
        {workouts.length > 0 ? (
          <ul>
            {workouts.map((w, index) => (
              <li key={index}>
                {w.workoutName} - {w.workoutSets} sets
              </li>
            ))}
          </ul>
        ) : (
          <p>no workouts for {currentDay}</p>
        )}
      </div>
      <Navbar />
    </div>
  );
}
