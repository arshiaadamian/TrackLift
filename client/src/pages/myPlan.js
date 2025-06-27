import React from "react";
import Navbar from "../components/navbar";
import "../style/workoutCard.css";
import WorkoutCard from "../components/workoutCard";

export default function MyPlan() {
  return (
    <div>
      <h1>My Plan</h1>
      <div id="workouts">
        <WorkoutCard day="Monday" />
        <WorkoutCard day="Tuesday" />
        <WorkoutCard day="Wednesday" />
        <WorkoutCard day="Thursday" />
        <WorkoutCard day="Friday" />
        <WorkoutCard day="Saturday" />
        <WorkoutCard day="Sunday" />
        <Navbar />
      </div>
    </div>
  );
}
