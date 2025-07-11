require("dotenv").config();
const express = require("express");
const cors = require("cors");
const port = process.env.port || 8000;
const app = express();
const MongoStore = require("connect-mongo");
const session = require("express-session");
const fs = require("fs");
const path = require("path");

// import the authentication and workout routes
const {
  signupFunction,
  signinFunction,
} = require("./routes/authentication.js");

const {
  addWorkoutFunction,
  removeWorkoutFunction,
  editDayNameFunction,
} = require("./routes/addWorkout.js");

// .env configuration
const mongodb_host = process.env.MONGODB_HOST;
const mongodb_database = process.env.MONGODB_DATABASE;
const mongodb_session_secret = process.env.MONGODB_SESSION_SECRET;
const node_session_secret = process.env.NODE_SESSION_SECRET;

// Set up MongoDB session store
const mongoStore = MongoStore.create({
  mongoUrl: mongodb_host,
  crypto: {
    secret: mongodb_session_secret,
  },
});

// connect to database
const { database } = require("./databaseConnection.js");
const userCollection = database.db(mongodb_database).collection("users");

// middlewares
app.use(cors());
app.use(express.static(__dirname + "/client/public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(
  session({
    secret: node_session_secret,
    store: mongoStore,
    resave: true,
    saveUninitialized: false,
  })
);

// API: Get current user info
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

// API: Load exercises from file
app.get("/api/exercises", async (req, res) => {
  const filePath = path.join(__dirname, "./exercises.json");
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return res.status(500).send("Failed to read exercises file.");
    }
    try {
      const jsonData = JSON.parse(data);
      res.json(jsonData);
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError);
      res.status(500).send("Failed to parse JSON.");
    }
  });
});

// Route handlers
app.use("/", signupFunction(userCollection));
app.use("/", signinFunction(userCollection));
app.use("/", addWorkoutFunction(userCollection));
app.use("/", removeWorkoutFunction(userCollection));
app.use("/", editDayNameFunction(userCollection));

// Test route
app.get("/test", (req, res) => {
  res.send("✅ Backend is working!");
});

// Serve React app (client/build) in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/build")));

  app.get("/*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client/build", "index.html"));
  });
}

// Start server
app.listen(port, () => {
  console.log("✅ App is running at http://localhost:" + port);
});
