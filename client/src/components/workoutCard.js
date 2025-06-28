import React from "react";
import "../style/workoutCard.css";
import { Link } from "react-router-dom";

export default function WorkoutCard({ day }) {
  return (
    <div className="workoutCard">
      <h2>{day}</h2>
      <p>workouts in that detail, click edit for more details</p>
      <Link to={`/workoutPage/${day}`} state={{ day }}>
        Edit
      </Link>
    </div>
  );
}
