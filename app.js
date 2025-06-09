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


var {database} = require('./databaseConnection.js');