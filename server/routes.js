const oracledb = require('oracledb');
const dbConfig = require('./db-config.js')
const async = require('async')

function connect() {
  return oracledb.getConnection({
      user: dbConfig.user,
      password: dbConfig.password,
      connectString: dbConfig.connectString
  });
}

function executeCmd(connection, cmd) {
  return connection.execute(cmd, []);
}


/* -------------------------------------------------- */
/* ------------------- Route Handlers --------------- */
/* -------------------------------------------------- */

function query(req, res) {
  console.log('querying db...')
  let connection;
  var query = req.body.query
  console.log(query)
  return connect().then(result => {
    connection = result;
    return executeCmd(connection, query);
  }).then(result => {
    return result.rows;
  }).then(result => {
    return connection.close().then(() => res.json({'results' : result}));
  }).catch(error => {
    console.log('ERROR executing query: ' + query)
    console.log(error)
  })
}



module.exports = {
  query : query,
}