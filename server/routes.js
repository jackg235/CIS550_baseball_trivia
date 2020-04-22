var config = require('./db-config.js');
var mysql = require('mysql');

config.connectionLimit = 10;
var connection = mysql.createPool(config);

/* -------------------------------------------------- */
/* ------------------- Route Handlers --------------- */
/* -------------------------------------------------- */



function query(req, res) {
  
};

// The exported functions, which can be accessed in index.js.
module.exports = {

}