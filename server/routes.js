const oracle = require('oracledb');
const dbConfig = require('./db-config.js')

oracledb.getConnection({
	  user          : dbConfig.user,
    password      : dbConfig.password,
  	connectString : dbConfig.connectString
    }, 
    function(err, connection) {
      if (err) {
      	console.log(err)
      	error = err; 
      	return;
      }
      
      connection.execute('select name from PLAYOFFBATTING', [], function(err, result) {
        if (err) {error = err; return;}
 
        user = result.rows[0][0];
        error = null;
 
        connection.close(function(err) {
          if (err) {console.log(err);}
        });
      })
    }
);

/* -------------------------------------------------- */
/* ------------------- Route Handlers --------------- */
/* -------------------------------------------------- */



function query(req, res) {
  console.log('entering query')
  console.log(config)
  res.send('backend connected')
};

// The exported functions, which can be accessed in index.js.
module.exports = {
  query : query
}