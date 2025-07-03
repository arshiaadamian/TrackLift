import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import Navbar from "./navbar";
import "../style/workoutPage.css";

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

  // handling empty input fields
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const error = params.get("error");

  return (
    <div>
      {/* This form is used to remove a workout from the list. */}
      <form
        style={{ display: "none" }}
        action="/workoutPage/removingWorkout"
        method="POST"
        id="removeWorkout"
      >
        <input type="hidden" name="day" value={day} />
        <input type="hidden" name="index" id="removeIndex" />
      </form>
      {/* end of the form to remove a workout from the list. */}

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
          {error === "missing_fields" && (
            <p style={{ color: "red" }}>Please fill in all the boxes.</p>
          )}
          <div className="workouts">
            <h2>Workouts for {day}</h2>
            {workouts && workouts.length > 0 ? (
              <ul>
                {workouts.map((w, index) => (
                  <li key={index}>
                    {w.workoutName} – {w.workoutSets} sets
                    <button
                      type="button"
                      onClick={() => {
                        document.getElementById("removeIndex").value = index;
                        document.getElementById("removeWorkout").submit();
                      }}
                    >
                      Remove
                    </button>
                  </li>
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
