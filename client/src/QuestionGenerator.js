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
	playoffBatting = ['H']

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
				"query": `select distinct name from teams where yearid > date '1960-04-01'`
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
		var questionIndex = Math.floor(Math.random() * 4);

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

		console.log(this.playoffBatting)

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
				var possibleStats = ['W', 'L', 'R', 'H', 'TWOB', 'THREEB', 'HR', 'BB', 'SO', 'SB']
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

			case 2 :
				question = `Which state has produced the most players to play on the ${team}?`
				query = `WITH players AS (
					select distinct playerID
					from batting b
					join teams t on b.teamID = t.teamID
					AND t.name = '${team}'
				),
				birth_states AS (
					SELECT birthState, COUNT(*)
					FROM People p
					JOIN players l on p.playerid = l.playerid
					GROUP BY birthState
					ORDER BY COUNT(birthState) DESC
				)
				SELECT birthState 
				from birth_states
				WHERE rownum < 11`
				return [question, query];

			case 3 :
				question = `Which team had the most ${teamStat} in a single season since ${year}
				without winning the world series?`
				var yr = year + '-04-01'
				query = `WITH Year AS (
					SELECT name, max(${teamStat}) AS homeruns
					FROM Teams
					WHERE yearID > date '${yr}'
					AND WSwin != 'Y'
					group by name
					ORDER BY max(${teamStat}) DESC
				)
				SELECT name
				FROM Year
				where rownum < 11`
				return [question, query];

			case 4 :
				var possibleStats = ['W', 'R', 'H', 'TWOB', 'THREEB', 'HR','SB']
				var possibleNums = [50, 20, 50, 20, 20, 20, 10]
				var idx = Math.floor(Math.random() * possibleStats.length)
				var stat = possibleStats[idx]
				var num = possibleNums[idx]
				if (year > 1980) {
					year = year - 40
				}
				var yearVal = year + ''
				question = `What college has produced the most players that:
				a. have won a WS
				b. have over 50 hits (some number for some stat)
				c. have played on at least 2 different teams
				since 1960 (input year)?`
				query = `
				WITH ws_teams AS (
					SELECT teamid, 
					FROM teams 
					WHERE yearID > date '1959-04-01'
					AND wswin = 'Y'
				),
				ws_batters AS (
					SELECT playerid, sum(H), count(distinct b.teamid)
					FROM batting b
					JOIN ws_teams w ON b.teamid = w.teamid
					AND b.yearid = w.yearID
					GROUP BY playerid
					HAVING sum(H) > 50
					AND count(distinct b.teamid) > 1
				),
				colleges AS (
					SELECT schoolid, count(w.playerid) AS num
					FROM ws_batters w 
					JOIN collegeplaying c ON w.playerid = c.playerid
					
					GROUP BY schoolid
				)
				SELECT name_full 
				FROM colleges c join schools s on c.schoolid = s.schoolid
				WHERE rownum < 11
				ORDER BY num DESC`
				return [question, query]

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