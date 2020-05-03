class QuestionGenerator {

	stats = ['HR'];
	years = ['2004'];
	teams = ["Philadelphia Phillies"];
	battingStats = ['BB'];
	pitchingStats = ['SO'];
	teamStats = ['HR'];
	peopleAttributes = ['WEIGHT'];
	college = ['STATE'];
	schools = ['CITY'];
	playoffBatting = ['K']

	constructor() {
		this.getTeamOptions();
		this.years = this.getYearOptions();
		this.getStats('BATTING', 5);
		this.getStats('PITCHING', 5);
		this.getStats('PEOPLE', 0);
		this.getStats('COLLEGEPLAYING', 0); 
		this.getStats('TEAMS', 5);
		this.getStats('PLAYOFFBATTING', 3);
		this.getStats('SCHOOLS', 0); 
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

			switch (tableName) {
				case 'BATTING':
					this.battingStats = stats;
					break;
				case 'PITCHING': 
					this.pitchingStats = stats;
					break;
				case "PEOPLE":
					this.peopleAttributes = stats
					break;
				case 'COLLEGEPLAYING': 
					this.college = stats;
					break;
				case 'TEAMS': 
					this.teamStats = stats;
					break;
				case 'PLAYOFFBATTING': 
					this.playoffBatting = stats;
					break;
				case 'SCHOOLS': 
					this.schools = stats;
					break;
				default:
					break;

			}
		})
	}

	getYearOptions() {
		var output = [];
		for (var i = 1900; i < 2019; i++) {
			output.push(i)
		}
		return output;
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

			this.teams = stats;
			return stats
		})
	}

	generateQuestion() {
		var statIndex = Math.floor(Math.random() * this.stats.length);
		var yearIndex = Math.floor(Math.random() * this.years.length);
		var teamIndex = Math.floor(Math.random() * this.teams.length);
		var battingIndex = Math.floor(Math.random() * this.battingStats.length);
		var pitchingIndex = Math.floor(Math.random() * this.pitchingStats.length);
		var peopleIndex = Math.floor(Math.random() * this.peopleAttributes.length);
		var teamStatsIndex = Math.floor(Math.random() * this.teamStats.length);
		var collegeIndex = Math.floor(Math.random() * this.college.length);
		var schoolsIndex = Math.floor(Math.random() * this.schools.length);
		var playoffBattingIndex = Math.floor(Math.random() * this.playoffBatting.length);
		var questionIndex = Math.floor(Math.random() * 2);

		var stat = this.stats[statIndex];
		var year = this.years[yearIndex];
		var team = this.teams[teamIndex];
		var bat = this.battingStats[battingIndex];
		var pitch = this.pitchingStats[pitchingIndex];
		var person = this.peopleAttributes[peopleIndex];
		var teamStat = this.teamStats[teamStatsIndex];
		var col = this.college[collegeIndex];
		var schl = this.schools[schoolsIndex];
		var playoffB = this.playoffBatting[playoffBattingIndex];

		var question = "";
		var query = "";

		switch (questionIndex) {
			case 0:
				question = `Who had the most ${playoffB} in the ${year} World Series and what team did he play for?`
				var yrLow = year + '-04-01'
				year += 1
				var yrHigh = year + '-04-01'
				query = `WITH players AS ( `
				+ ` SELECT name, team ` 
				+ ` FROM playoffbatting `
				+ ` where year between date '${yrLow}' and date '${yrHigh}'` 
				+ ` AND round = 'WS'`
				+ ` order by ${playoffB} DESC )`
				+ ` Select distinct * from players where rownum < 11`
				return [question, query];
			
			case 1 :
				var possibleStats = ['W', 'L', 'DivWin', 'R', 'H', '2B', 'HR', 'BB', 'SO', 'SB']
				var caseStat = possibleStats[Math.floor(Math.random() * possibleStats.length)];

				var decade = parseInt(year / 10, 10) * 10
				question = `In the ${decade}'s, which team had the most ${caseStat}'s in the MLB with a pitcher 
				who started over 50 games with an average ERA of less than 4? Who was that pitcher?`
				console.log(decade)
				var decadeLow = decade + '-04-01'
				decade += 10
				var decadeHigh = decade + '-04-01'
				query = `WITH decade AS (
					SELECT Name AS team_name, teamID, sum(${caseStat}) AS wins
					FROM Teams
					WHERE yearID between date '${decadeLow}' and date '${decadeHigh}'
					group by Name, teamID
				),
				pitcher AS (
					SELECT playerID, teamID, avg(era), sum(gs)
					FROM pitching
					WHERE yearID between date '${decadeLow}' and date '${decadeHigh}'
					group by playerID, teamID
					HAVING avg(era) < 4 AND sum(gs) > 50
				),
				pitcher_name AS (
					SELECT nameGiven, team_name, wins
					FROM pitcher t 
					JOIN people p ON t.playerid = p.playerid
					JOIN decade d ON d.teamID = t.teamID
				)
				SELECT team_name, nameGiven
				FROM pitcher_name
				WHERE rownum < 11
				ORDER BY wins`
				return [question, query];

		}


		// return dummies for now bc queries r incorrect
		var dummyQuestion = `Year: ${year}, Team: ${team}, TeamStat: ${teamStat}, BattingStats: ${bat}, PitchingStates: ${pitch}, Person: ${person}, College: ${col}, School: ${schl}, Playoffs: ${playoffB}`;
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