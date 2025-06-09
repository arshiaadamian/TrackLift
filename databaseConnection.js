require("dotenv").config();

// gateway to connect to mogodb collections
const MongoClient = require('mongodb').MongoClient;

const atlasURI = process.env.MONGODB_HOST;

// create a new MongoClient instance called database
const database = new MongoClient(atlasURI, {});

module.exports = {database};
