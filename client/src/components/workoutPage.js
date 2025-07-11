import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import Navbar from "./navbar";
import "../style/workoutPage.css";

export default function WorkoutPage() {
  const { day } = useParams();
  const [workouts, setWorkouts] = useState([]);
  const API_URL = process.env.REACT_APP_API_URL || "";
  useEffect(() => {
    fetch(`${API_URL}/api/user`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setWorkouts(data[day] || ["error setting workouts"]);
      })
      .catch((err) => console.error("Error fetching workouts:", err));
  }, [day]);

  // handling empty input fields
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const error = params.get("error");

  // getting the name of the day from the database.
  const [dayName, setDayName] = useState("");
  useEffect(() => {
    fetch(`${API_URL}/api/user`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setDayName(data.dayName || "No name set for this day");
      });
  }, []);
  const [isEditing, setIsEditing] = useState(false);

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

      <h1>
        {day} {dayName === "Name of the day" ? "" : `- ${dayName}`}
      </h1>

      {/* Form to get the name of the day */}
      <form className="dayName" action="editDayName" method="POST">
        <input type="hidden" name="day" value={day} />
        <input
          type="text"
          placeholder="Name of the day"
          name="dayName"
          value={dayName}
          onChange={(e) => setDayName(e.target.value)}
          disabled={!isEditing}
          style={{
            backgroundColor: isEditing ? "white" : "lightgray",
            cursor: isEditing ? "text" : "not-allowed",
          }}
        ></input>
        <button
          type={isEditing ? "submit" : "button"}
          id="edit"
          onClick={(e) => {
            if (!isEditing) {
              e.preventDefault();
              setIsEditing(true);
            }
          }}
        >
          {isEditing ? "Save" : "Edit"}
        </button>
      </form>
      {/* end of the form to get the name of the day. */}

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
