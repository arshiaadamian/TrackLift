const express = require("express");
const router = express.Router();

const addWorkoutFunction = (userCollection) => {
  router.post("/workoutPage/addWorkout", async (req, res) => {
    console.log("add workout function hit");
    if (req.session.authenticated !== true) {
      return res.redirect("/login");
    }
    const { workoutName, workoutSets, day } = req.body;

    // testing the values received from the form
    // console.log("day is " + day);
    // console.log("workoutName is " + workoutName);
    // console.log("workoutSets is " + workoutSets);
    // console.log("username is " + req.session.username);

    // insert the workout into the user's workouts array
    const update = { workoutName, workoutSets };

    await userCollection.updateOne(
      { username: req.session.username },
      { $push: { [day]: update } }
    );

    res.redirect(`/workoutPage/${day}`);
  });

  return router;
};

const removeWorkoutFunction = (userCollection) => {
  router.post("/workoutPage/removingWorkout", async (req, res) => {
    console.log("remove workout function hit");
    if (req.session.authenticated !== true) {
      return res.redirect("/login");
    }
    const day = req.body.day;
    console.log("day is " + day);
    res.redirect(`/workoutPage/${day}`);
  });

  return router;
};

module.exports = { addWorkoutFunction, removeWorkoutFunction };
