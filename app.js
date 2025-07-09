require("dotenv").config();
const express = require("express");
const port = process.env.port || 8000;
const app = express();
const MongoStore = require("connect-mongo");
const session = require("express-session");
const fs = require("fs");
const path = require("path");

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
app.use(express.static(__dirname + "/client/public"));
// middleware to parse HTML elements into request body
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
  const filePath = path.join(
    __dirname,
    "./client/src/components/exercises.json"
  );
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

// middleware for the signup function
app.use("/", signupFunction(userCollection));

// middleware for the signin function
app.use("/", signinFunction(userCollection));

// middleware for the workout page
app.use("/", addWorkoutFunction(userCollection));

app.use("/", removeWorkoutFunction(userCollection));

app.use("/", editDayNameFunction(userCollection));

// run server
app.listen(port, function () {
  console.log("app is live on http://localhost:" + port);
});
