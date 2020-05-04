const oracledb = require('oracledb');
const dbConfig = require('./db-config.js')

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

function getLeaderboard(req, res) {
  console.log('fetching leaderboard...')
  let connection;
  var query = 'SELECT name, score FROM leaderboard ORDER BY score DESC'
  console.log(query)
  return connect().then(result => {
    connection = result;
    return executeCmd(connection, query);
  }).then(result => {
    console.log(result.rows)
    return result.rows;
  }).then(result => {
    return connection.close().then(() => res.json({'results' : result}));
  }).catch(error => {
    console.log('ERROR executing query: ' + query)
    console.log(error)
  })
}

function addToLeaderboard(req, res) {
  console.log('fetching leaderboard...')
  let connection;
  var name = req.body.name;
  var score = req.body.score;
  var query = `insert into leaderboard values ('${name}', ${score})`
  return connect().then(result => {
    connection = result;
    return executeCmd(connection, query);
  }).then(result => {
    return result.rows;
  }).then(result => {
    deleteLastPlace() // delete the person ranked 10th on the ldeaderboard
    return connection.close().then(() => res.json({'success' : true}));
  }).catch(error => {
    console.log('ERROR executing query: ' + query)
    console.log(error)
    res.json({'success' : false})
  })
}

function deleteLastPlace() {
  console.log('deleting last place...')
  let connection;
  var query = `DELETE FROM leaderboard
                WHERE score = (SELECT MIN(score) FROM leaderboard) and
                rownum = 1;`
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
  getLeaderboard : getLeaderboard,
  addToLeaderboard : addToLeaderboard
}