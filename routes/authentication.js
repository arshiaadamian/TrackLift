const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const saltRounds = 12;
const expireTime = 1 * 60 * 60 * 1000; // 1 hour in milliseconds

const signupFunction = (userCollection) => {
  router.post("/submitUser", async (req, res) => {
    console.log("signup route hit");
    // values of username and password are taken from the request body
    const { username, password } = req.body;

    // check if username and password are provided
    if (!username || !password) {
      console.log("username and password are required");
      return res.status(400).send("Username and password are required");
    }

    // check if the user already exists in the database
    const existingUser = await userCollection.findOne({ username: username });
    if (existingUser) {
      console.log("user already exists");
      return res.redirect("/signup?error=user_exists");
    }

    // hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // insert the new user into the database
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

    // set the session with the username and expiration time
    req.session.authenticated = true;
    req.session.username = username;
    req.session.cookie.maxAge = expireTime;

    // redirect to the home page after successful signup
    res.redirect("/");
  });

  return router;
};

// post login
const signinFunction = (userCollection) => {
  router.post("/loggingin", async (req, res) => {
    console.log("signin route hit");
    const { username, password } = req.body;
    console.log(username);
    console.log("password: " + password);
    const user = await userCollection.findOne({ username: username });

    // check if the user does not exist
    if (!user) {
      console.log("user not found");
      return res.redirect("/login?error=user_not_exist");
    }

    // check if the password is correct
    // bcrypt.compare is used to compare the provided password with the hashed password in the database
    const validPassword = await bcrypt.compare(password, user.password);
    console.log("valid password: " + validPassword); // for debugging purposes
    if (!validPassword) {
      console.log("password is incorrect");
      return res.redirect("/login?error=incorrect_password");
    }

    req.session.authenticated = true;
    req.session.username = username;
    req.session.cookie.maxAge = expireTime;
    req.session.user_id = user._id;
    console.log(req.session.user_id);

    // redirect to the home page after successful login
    res.redirect("/");
  });

  return router;
};

// export the signup and signin functions
module.exports = {
  signupFunction,
  signinFunction,
};
