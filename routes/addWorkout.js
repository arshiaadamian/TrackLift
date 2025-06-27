const express = require("express");
const router = express.Router();

const addWorkoutFunction = (userCollection) => {
  router.post("/addWorkout", async (req, res) => {
    console.log("add workout function hit");
    if (req.session.authenticated !== true) {
      return res.redirect("/login");
    }
    const { workoutName, workoutSets, day } = req.body;

    // testing the values received from the form
    console.log("day is " + day);
    console.log("workoutName is " + workoutName);
    console.log("workoutSets is " + workoutSets);
    console.log("username is " + req.session.username);

    // insert the workout into the user's workouts array
    const update = { workoutName: workoutName, workoutSets: workoutSets };

    await userCollection.updateOne(
      { userName: req.session.username },
      { $push: { [day]: update } }
    );

    res.redirect("/workoutPage");
  });

  return router;
};

module.exports = addWorkoutFunction;
