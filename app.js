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

// API routes - must come before static file serving
app.use("/api", signupFunction(userCollection));
app.use("/api", signinFunction(userCollection));
app.use("/api", addWorkoutFunction(userCollection));
app.use("/api", removeWorkoutFunction(userCollection));
app.use("/api", editDayNameFunction(userCollection));

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
