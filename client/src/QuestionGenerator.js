class QuestionGenerator {

	stats = [];
	years = [];
	teams = [];
	battingStats = [];
	pitchingStats = [];
	peopleAttributes = [];
	college = [];
	teams = [];
	schools = [];
	playoffBatting = []

	constructor() {
		//this.teams = this.getTeamOptions();
		//this.stats = this.getStatOptions();
		this.years = this.getYearOptions();
		this.battingStats = this.getStats('BATTING', 5);
		this.pitchingStats = this.getStats('PITCHING', 5);
		this.peopleAttributes = this.getStats('PEOPLE', 0);
		this.college = this.getStats('COLLEGEPLAYING', 0); 
		this.teamStats = this.getStats('TEAMS', 5);
		this.playoffBatting = this.getStats('PLAYOFFBATTING', 3);
		this.schools = this.getStats('SCHOOLS', 0); 
	}
	// TODO get these from database call
	getStatOptions() {
		return ["home-runs", "wins"];
	}

	getStats(tableName, numSkip) {
		console.log('getting stats for ' + tableName)
		fetch('http://localhost:5000/query', {
			method: 'post',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			},
			body: JSON.stringify({
				"query": `select column_name from all_tab_cols where TABLE_NAME = '${tableName}'`
			})
		}).then(res => {
			return res.json();
		}, err => {
			console.log(err);
		}).then(results => {
			if (!results) return;
			var stats2d = results["results"];
			var stats = []
			var i;
			if (stats2d == null) {
				console.log('error retrieving table ' + tableName)
				return null
			}
			// ignore first few stats (player id, league id, etc.)
			for (i = numSkip; i < stats2d.length; i++) {
				stats.push(stats2d[i][0])
			}
			return stats
		})
	}

	getYearOptions() {
		return ["2004", "1983"];
	}

	getTeamOptions() {
		console.log('getting team options...')
		fetch('http://localhost:5000/query', {
			method: 'post',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			},
			body: JSON.stringify({
				"query": 'select distinct name from teams'
			})
		}).then(res => {
			return res.json();
		}, err => {
			console.log(err);
		}).then(results => {
			if (!results) return;
			var stats2d = results["results"];
			var stats = []
			var i;
			if (stats2d == null) {
				console.log('error retrieving teams ')
				return null
			}
			for (i = 0; i < stats2d.length; i++) {
				stats.push(stats2d[i][0])
			}
			return stats
		})
	}

	generateQuestion() {
		var statIndex = Math.floor(Math.random() * this.stats.length);
		var yearIndex = Math.floor(Math.random() * this.years.length);
		var teamIndex = Math.floor(Math.random() * this.teams.length);
		var questionIndex = Math.floor(Math.random() * 7);
		var stat = this.stats[statIndex];
		var year = this.years[yearIndex];
		var team = this.teams[teamIndex];

		var question = "";
		var query = "";

		// return dummies for now bc queries r incorrect
		var dummyQuestion = "I'm a dummy question! Look at me!"
		var dummyQuery =  'select nameGiven from People where rownum < 11';
		return [dummyQuestion, dummyQuery];

		switch (questionIndex) {
			case 0:
				question = `Which player had the most ${stat} in ${year}?`;
				query = `WITH Stat AS (` +
					`SELECT name, ${stat}` +
					` FROM Batting` +
					` WHERE yearID == ${year}` +
					`SELECT name, MAX(${stat})` +
					` FROM Stat` +
					` GROUP BY ${stat}` +
					` HAVING ROWNUM == 1`;
				return [question, query];
			case 1:
				question = `Which player had the fewest ${stat} in ${year}?`;
				query = `WITH Stat AS (` +
					`SELECT name, ${stat}` +
					` FROM Batting` +
					` WHERE yearID == ${year}` +
					`SELECT name, MIN(${stat})` +
					` FROM Stat` +
					` GROUP BY ${stat}` +
					` HAVING ROWNUM == 1`;

				return [question, query];
			case 2:
				question = `Which pitcher had the most ${stat} in ${year}?`;
				query = `WITH Stat AS (` +
					`SELECT name, ${stat}` +
					` FROM Pitching` +
					` WHERE yearID == ${year})` +
					`SELECT name, MAX(${stat})` +
					` FROM Stat` +
					` GROUP BY ${stat}` +
					` HAVING ROWNUM == 1`;

				return [question, query];
			case 3:
				question = `Which pitcher had the fewest ${stat} in ${year}?`;
				query = `WITH Stat AS (` +
					`SELECT name, ${stat}` +
					` FROM Pitching` +
					` WHERE yearID == ${year}` +
					`SELECT name, MIN(${stat})` +
					` FROM Stat` +
					` GROUP BY ${stat}` +
					` HAVING ROWNUM == 1`;

				return [question, query];
			case 4:
				question = `Which ${team} player holds the team record for the most ${stat} in a World Series?`;
				query = `SELECT name, MAX(${stat})` +
					` FROM world_series_batting` +
					` WHERE TEAM = ${team}` +
					` GROUP BY name` +
					` HAVING ROWNUM == 1`;

				return [question, query];
			case 5:
				question = `Who is the lightest player to hit 50 home-runs in a season?`;
				query = `WITH Weights AS (` +
					`SELECT playerID, nameFirst, nameLast, weight` +
					` FROM People)` +
					`SELECT nameFirst, nameLast, MIN(weight)` +
					` FROM Weights w JOIN Batting b ON b.playerID == w.playerID` +
					` GROUP BY weight` +
					` HAVING HR > 50`;
				return [question, query];
			case 6:
				question = `Which state has produced the most professional players?`;
				query = `SELECT birthState, COUNT(birthState)` +
					` FROM People` +
					` GROUP BY birthState` +
					` SORT BY COUNT(birthState) ASC` +
					` HAVING ROWNUM == 1`;

				return [question, query]

			default:

		}
	}
}
export default QuestionGenerator;