import React from "react";
import { useLocation } from "react-router-dom";

export default function WorkoutPage() {
  const location = useLocation();
  const { day } = location.state || {};
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
        </form>
      </div>
    </div>
  );
}
