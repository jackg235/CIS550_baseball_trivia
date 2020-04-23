const bodyParser = require('body-parser');
const express = require('express');
var routes = require("./routes.js");
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

var config = require('./db-config.js');
var mysql = require('mysql');

// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));

// create a GET route
app.get('/query', routes.query);