const oracledb = require('oracledb');
const dbConfig = require('./db-config.js')
let connection;

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

function connectAndQuery(query, callback) {
  let connection;
  return connect().then(result => {
    connection = result;
    return executeCmd(connection, query);
  }).then(result => {
    console.log(result.rows)
    return result.rows;
  }).then(result => {
    return connection.close().then(() => callback(result));
  });
}

/* -------------------------------------------------- */
/* ------------------- Route Handlers --------------- */
/* -------------------------------------------------- */

function query(req, res) {
  var q = req.body.query
  var dummy = 'select nameGiven from People where rownum < 11';
  connectAndQuery(dummy, function(result) {
    res.json({'results' : result})
  });
};

// currently doesn't work
function headerCallback(callback) {
  var headerArr = []
  var tables = ['batting', 'pitching', 'people', 'collegeplaying', 'teams', 'school', 'playoffbatting']
  var i;
  for (i = 0; i < tables.length; i++) {
    console.log('retrieving ' + tables[i])
    var query = `select column_name from all_tab_cols where TABLE_NAME = "${tables[i]}"`
    connectAndQuery(query, function(result) {
      headerArr.push({
        key : tables[i],
        value : result
      })
    });
  }
  console.log(headerArr)
  callback(headerArr)
}


function get_headers(req, res) {
  headerCallback(function(result) {
    res.json(result)
  });
}


module.exports = {
  query : query,
  get_headers : get_headers
}