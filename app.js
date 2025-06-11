require('dotenv').config();
const express = require('express');
const port = process.env.port || 8000;
const app = express();
const MongoStore = require('connect-mongo');
const session = require('express-session');


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
var {database} = require('./databaseConnection.js');
// accessing the users collection in the database
const userCollection = database.db(mongodb_database).collection("users");

// middleware to have access to all files in /public with no further routing needed
app.use(express.static('/public'));
// middleware to parse HTML elements into request body
app.use(express.urlencoded({extended: false}));


// middleware to store sessiions in mongoDB instead of memory
app.use(session({
    secret: node_session_secret,
    store: mongoStore,
    resave: true,
    saveUninitialized: false,
}));




// creating a user under the user collection for testing purposes
userCollection.insertOne({
    name: "Arshia",
    email: "arshiaadamian@gmail.com"
}) 


// run server
app.listen(port, function(){
    console.log("app is live on " + port);
})

