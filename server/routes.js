const oracle = require('oracledb');

oracle.getConnection({
	user          : "apje_project",
    password      : "A1s2d3f4G54321",
  	connectString: "apje_project@(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=cis450project.c7pyba5j5lto.us-east-1.rds.amazonaws.com)(PORT=1521))(CONNECT_DATA=(SID=APJEPROJ)))",
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