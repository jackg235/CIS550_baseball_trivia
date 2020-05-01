const oracledb = require('oracledb');
const dbConfig = require('./db-config.js')
let connection;

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
        console.log(user)
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

function get_results(query) {
  var ret;
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

        ret = result.rows
        console.log(ret)
        connection.close(function(err) {
          if (err) {console.log(err);}
        });
      })
    }
  );
  return ret
}


function query(req, res) {
  var q = req.body.query
  var ret;
  console.log(q)
  var dummy_query = 'select nameGiven from People where rownum < 11'
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
      connection.execute(dummy_query, [], function(err, result) {
        if (err) {
          console.log(err)
          return;
        }

        ret = result.rows
        res.json({'results' : ret})
        console.log(ret)
        connection.close(function(err) {
          if (err) {console.log(err);}
        });
      })
    }
  );
};


module.exports = {
  query : query
}