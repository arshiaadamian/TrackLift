const express = require("express");
const router = express.Router();

const addWorkoutFunction = (userCollection) => {
  router.post("/workoutPage/addWorkout", async (req, res) => {
    console.log("add workout function hit");
    if (req.session.authenticated !== true) {
      return res.redirect("/login");
    }
    const { workoutName, workoutSets, day } = req.body;

    if (!workoutName || !workoutSets) {
      return res.redirect(`/workoutPage/${day}?error=missing_fields`);
    }

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
    const { day, index } = req.body;
    console.log("day is " + day);
    console.log("index is " + index);

    const user = await userCollection.findOne({
      username: req.session.username,
    });

    const indexValue = user[day][index];
    console.log("indexValue is " + indexValue);

    // find the user and remove the workout at the specified index
    await userCollection.updateOne(
      { username: req.session.username },
      { $pull: { [day]: indexValue } }
    );

    res.redirect(`/workoutPage/${day}`);
  });

  return router;
};

const editDayNameFunction = (userCollection) => {
  router.post("/workoutPage/editDayName", async (req, res) => {
    console.log("edit day name function hit");
    const day = req.body.day;
    const dayName = req.body.dayName;
    await userCollection.updateOne(
      { username: req.session.username },
      { $set: { dayName: dayName } }
    );

    res.redirect(`/workoutPage/${day}`);
  });

  return router;
};

module.exports = {
  addWorkoutFunction,
  removeWorkoutFunction,
  editDayNameFunction,
};
