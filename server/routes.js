var config = require('./db-config.js');
let mysql = require('mysql');
var connection = mysql.createPool(config);


/* -------------------------------------------------- */
/* ------------------- Route Handlers --------------- */
/* -------------------------------------------------- */



function query(req, res) {
  console.log('entering query')
  console.log(config)
  var query = `
    SELECT NAME FROM PLAYOFFBATTING
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      console.log(rows)
      res.json(rows);
    }
  });
};

// The exported functions, which can be accessed in index.js.
module.exports = {
  query : query
}