require("dotenv").config();
const express = require("express");
const cors = require("cors");
const port = process.env.port || 8000;
const app = express();
const MongoStore = require("connect-mongo");
const session = require("express-session");
const fs = require("fs");
const path = require("path");

// CORS configuration with environment variable support
// const allowedOrigins = [
//   "https://tracklift-client.onrender.com",
//   "http://localhost:3000",
// ];

// app.use((req, res, next) => {
//   const origin = req.headers.origin;

//   if (allowedOrigins.includes(origin)) {
//     res.setHeader("Access-Control-Allow-Origin", origin);
//   }

//   res.setHeader("Access-Control-Allow-Credentials", "true");
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, PUT, DELETE, OPTIONS"
//   );
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

//   // Handle preflight
//   if (req.method === "OPTIONS") {
//     return res.sendStatus(200);
//   }

//   next();
// });

// import the authentication routes
const {
  signupFunction,
  signinFunction,
} = require("./routes/authentication.js");

const {
  addWorkoutFunction,
  removeWorkoutFunction,
  editDayNameFunction,
} = require("./routes/addWorkout.js");

// secret .env information
const mongodb_host = process.env.MONGODB_HOST;
const mongodb_user = process.env.MONGODB_USER;
const mongodb_password = process.env.MONGODB_PASSWORD;
const mongodb_database = process.env.MONGODB_DATABASE;
const mongodb_session_secret = process.env.MONGODB_SESSION_SECRET;
const node_session_secret = process.env.NODE_SESSION_SECRET;

// Save sessions in mongoDB instead of memory
const mongoStore = MongoStore.create({
  mongoUrl: mongodb_host,
  crypto: {
    secret: mongodb_session_secret,
  },
});

// using database connection
var { database } = require("./databaseConnection.js");
// accessing the users collection in the database
const userCollection = database.db(mongodb_database).collection("users");

// middleware to have access to all files in /public with no further routing needed
// app.use(express.static(__dirname + "/client/public"));
// middleware to parse JSON and HTML elements into request body
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// middleware to store sessiions in mongoDB instead of memory
app.use(
  session({
    secret: node_session_secret,
    store: mongoStore,
    resave: true,
    saveUninitialized: false,
  })
);

// API routes
app.get("/api/user", async (req, res) => {
  if (!req.session.authenticated || !req.session.username) {
    return res.status(401).json({ error: "not authenticated" });
  }

  const user = await userCollection.findOne({ username: req.session.username });

  if (!user) {
    return res.status(404).json({ error: "user not found" });
  }

  res.json(user);
});

// Get route to send excersise data to the JSON
app.get("/api/exercises", async (req, res) => {
  const filePath = path.join(__dirname, "./exercises.json");
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("error reading file: ", err);
      return res.status(500).send("Failed to read exercises file.");
    }
    try {
      const jsonData = JSON.parse(data);
      res.json(jsonData);
    } catch (parseError) {
      console.error("Error parsing JSON: ", parseError);
      res.status(500).send("Failed to parse JSON.");
    }
  });
});

// Authentication routes
app.post("/api/submitUser", async (req, res) => {
  console.log("signup route hit");
  const { username, password } = req.body;

  if (!username || !password) {
    console.log("username and password are required");
    return res.status(400).send("Username and password are required");
  }

  const existingUser = await userCollection.findOne({ username: username });
  if (existingUser) {
    console.log("user already exists");
    return res.redirect("/signup?error=user_exists");
  }

  const bcrypt = require("bcrypt");
  const saltRounds = 12;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  await userCollection.insertOne({
    username: username,
    password: hashedPassword,
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: [],
    dayName: "Name of the day",
  });

  console.log("user created successfully");
  req.session.authenticated = true;
  req.session.username = username;
  req.session.cookie.maxAge = 1 * 60 * 60 * 1000; // 1 hour
  res.redirect("/");
});

app.post("/api/loggingin", async (req, res) => {
  console.log("signin route hit");
  const { username, password } = req.body;
  const user = await userCollection.findOne({ username: username });

  if (!user) {
    console.log("user not found");
    return res.redirect("/login?error=user_not_exist");
  }

  const bcrypt = require("bcrypt");
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    console.log("password is incorrect");
    return res.redirect("/login?error=incorrect_password");
  }

  req.session.authenticated = true;
  req.session.username = username;
  req.session.cookie.maxAge = 1 * 60 * 60 * 1000; // 1 hour
  req.session.user_id = user._id;
  res.redirect("/");
});

// Workout routes
app.post("/api/workoutPage/addWorkout", async (req, res) => {
  console.log("add workout function hit");
  if (req.session.authenticated !== true) {
    return res.redirect("/login");
  }
  const { workoutName, workoutSets, day } = req.body;

  if (!workoutName || !workoutSets) {
    return res.redirect(`/workoutPage/${day}?error=missing_fields`);
  }

  const update = { workoutName, workoutSets };
  await userCollection.updateOne(
    { username: req.session.username },
    { $push: { [day]: update } }
  );

  res.redirect(`/workoutPage/${day}`);
});

app.post("/api/workoutPage/removingWorkout", async (req, res) => {
  console.log("remove workout function hit");
  if (req.session.authenticated !== true) {
    return res.redirect("/login");
  }
  const { day, index } = req.body;

  const user = await userCollection.findOne({
    username: req.session.username,
  });

  const indexValue = user[day][index];
  await userCollection.updateOne(
    { username: req.session.username },
    { $pull: { [day]: indexValue } }
  );

  res.redirect(`/workoutPage/${day}`);
});

app.post("/api/workoutPage/editDayName", async (req, res) => {
  console.log("edit day name function hit");
  const day = req.body.day;
  const dayName = req.body.dayName;
  await userCollection.updateOne(
    { username: req.session.username },
    { $set: { dayName: dayName } }
  );

  res.redirect(`/workoutPage/${day}`);
});

// for testing purposes
app.get("/test", (req, res) => {
  res.send("✅ Backend is working!");
});

// Serve static files from React build
app.use(express.static(path.join(__dirname, "client", "build")));

// Catch-all route to serve React for any route not handled by API
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

// run server
app.listen(port, function () {
  console.log("app is live on http://localhost:" + port);
});
