require("dotenv").config();
const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 8000; // Changed 'port' to 'PORT' (standard environment variable name)
const app = express();
const MongoStore = require("connect-mongo");
const session = require("express-session");
const fs = require("fs");
const path = require("path");

// Import route handlers
const {
  signupFunction,
  signinFunction,
} = require("./routes/authentication.js");

const {
  addWorkoutFunction,
  removeWorkoutFunction,
  editDayNameFunction,
} = require("./routes/addWorkout.js");

// Database configuration
const mongodb_host = process.env.MONGODB_HOST;
const mongodb_user = process.env.MONGODB_USER;
const mongodb_password = process.env.MONGODB_PASSWORD;
const mongodb_database = process.env.MONGODB_DATABASE;
const mongodb_session_secret = process.env.MONGODB_SESSION_SECRET;
const node_session_secret = process.env.NODE_SESSION_SECRET;

const mongoStore = MongoStore.create({
  mongoUrl: mongodb_host,
  crypto: {
    secret: mongodb_session_secret,
  },
});

// Database connection
var { database } = require("./databaseConnection.js");
const userCollection = database.db(mongodb_database).collection("users");

// Middleware setup
app.use(cors()); // Add CORS support
app.use(express.json()); // Add JSON body parsing
app.use(express.static(path.join(__dirname, "client/public")));
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: node_session_secret,
    store: mongoStore,
    resave: true,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // Enable secure cookies in production
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// API Routes - prefix with /api for better organization
app.get("/api/user", async (req, res) => {
  if (!req.session.authenticated || !req.session.username) {
    return res.status(401).json({ error: "not authenticated" });
  }
  const user = await userCollection.findOne({ username: req.session.username });
  if (!user) return res.status(404).json({ error: "user not found" });
  res.json(user);
});

app.get("/api/exercises", async (req, res) => {
  const filePath = path.join(__dirname, "./exercises.json");
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) return res.status(500).send("Failed to read exercises file.");
    try {
      res.json(JSON.parse(data));
    } catch (parseError) {
      res.status(500).send("Failed to parse JSON.");
    }
  });
});

// Mount route handlers with /api prefix
app.use("/api/auth", signupFunction(userCollection));
app.use("/api/auth", signinFunction(userCollection));
app.use("/api/workouts", addWorkoutFunction(userCollection));
app.use("/api/workouts", removeWorkoutFunction(userCollection));
app.use("/api/workouts", editDayNameFunction(userCollection));

// Test route
app.get("/api/test", (req, res) => {
  res.send("✅ Backend is working!");
});

// Client-side routing - MUST COME AFTER ALL API ROUTES
if (process.env.NODE_ENV === "production") {
  // Serve static files from React build
  app.use(express.static(path.join(__dirname, "client/build")));

  // Handle React routing, return all requests to React app
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
