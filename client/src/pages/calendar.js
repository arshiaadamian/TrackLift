import React, { useEffect, useState } from "react";
import Navbar from "../components/navbar.js";

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
  useEffect(() => {
    fetch("/api/user")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setWorkouts(data[currentDay] || ["No workouts scheduled for today"]);
      });
  }, [currentDay]);
  return (
    <div>
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
