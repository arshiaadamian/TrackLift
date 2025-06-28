import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "./navbar";

export default function WorkoutPage() {
  const { day } = useParams();
  const [workouts, setWorkouts] = useState([]);
  useEffect(() => {
    fetch("/api/user")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setWorkouts(data[day] || ["error setting workouts"]);
        console.log("Fetched workouts:", data[day]);
      })
      .catch((err) => console.error("Error fetching workouts:", err));
  }, [day]);
  return (
    <div>
      <h1>{day || "unknown day, error"}</h1>
      <div className="add">
        <form action="addWorkout" method="POST">
          <input
            type="text"
            placeholder="Name of workout"
            name="workoutName"
          ></input>
          <input
            type="number"
            placeholder="number of sets"
            min="0"
            max="100"
            name="workoutSets"
          ></input>
          <input style={{ display: "none" }} name="day" value={day} />
          <button type="submit">Add workout</button>

          <div className="workouts">
            <h2>Workouts for {day}</h2>
            {workouts && workouts.length > 0 ? (
              <ul>
                {workouts.map((w, index) => (
                  <form action="removingWorkout" method="POST" key={index}>
                    <input style={{ display: "none" }} name="day" value={day} />
                    <li key={index}>
                      {w.workoutName} – {w.workoutSets} sets
                      <button>Remove</button>
                    </li>
                  </form>
                ))}
              </ul>
            ) : (
              <p>No workouts yet.</p>
            )}
          </div>
        </form>
      </div>
      <Navbar />
    </div>
  );
}
