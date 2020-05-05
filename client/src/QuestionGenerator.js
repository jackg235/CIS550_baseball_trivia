// Class to randomly generate a question on demand
class QuestionGenerator {

	// Initialize variables in case the queries do not return in time
	stats = ['HR'];
	years = ['2004', '1920', '1987'];
	teams = ["Philadelphia Phillies", "New York Mets", "Pittsburgh Pirates"];
	battingStats = ['BB'];
	pitchingStats = ['SO'];
	teamStats = ['HR'];
	peopleAttributes = ['WEIGHT'];
	college = ['STATE'];
	schools = ['CITY'];
	playoffBatting = ['H']
	json = require('./stats.json');

	// Get all of the posible field values upon construction
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

	// Pull the possible stat columns from the tables
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
			// Ignore first few stats (player id, league id, etc.)
			var ig = 0
			if (tableName == 'TEAMS') {
				ig = 5
			}
			for (i = numSkip; i < stats2d.length - ig; i++) {
				stats.push(stats2d[i][0])
			}

			// Store in the proper variable based on the table
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

	// Return all years from 1900 to the present
	getYearOptions() {
		var output = [];
		for (var i = 1900; i < 2019; i++) {
			output.push(i)
		}
		return output;
	}

	// Pull all the possible teams
	getTeamOptions() {
		console.log('getting team options...')
		fetch('http://localhost:5000/query', {
			method: 'post',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			},
			body: JSON.stringify({
				"query": `select distinct name from teams where yearid > date '1980-04-01'`
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

	// Generate a question based off the generated values and randomization
	generateQuestion() {

		// Get a random index for each type of fill in the blank
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
		var questionIndex = Math.floor(Math.random() * 8);

		// Get the associated value
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

		// Choose a random question template and fill in the values, 
		// Return the English question and SQL query
		var question = "";
		var query = "";
		console.log('QUESTION INDEX ' + questionIndex);
		switch (questionIndex) {
			case 0:
				question = `Who had the most ${this.json[playoffB]} in the ${year} World Series and what team did he play for?`
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
				question = `In the ${decade}'s, which team had the most ${this.json[caseStat]} in the MLB with a pitcher 
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
					SELECT concat(concat(namefirst,' '), namelast) AS full_name, team_name, wins
					FROM pitcher t 
					JOIN people p ON t.playerid = p.playerid
					JOIN decade d ON d.teamID = t.teamID
				)
				SELECT team_name, full_name
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
				question = `Which team had the most ${this.json[teamStat]} in a single season since ${year}
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
				var possibleStats = ['RBI', 'R', 'H', 'TWOB', 'THREEB', 'HR','SB']
				var possibleNums = [50, 20, 50, 20, 15, 20, 10]
				var idx = Math.floor(Math.random() * possibleStats.length)
				var stat = possibleStats[idx]
				var num = possibleNums[idx]
				if (year > 1970) {
					year = year - 60
				}
				var yearVal = year + '-04-01'
				question = `What college has produced the most players that have done the following: won a World Series,
				had over ${num} ${this.json[stat]}, and played on at least 2 different teams since ${year}?`
				query = `
				WITH ws_teams AS (
					SELECT teamid, yearID 
					FROM teams 
					WHERE yearID > date '${yearVal}'
					AND wswin = 'Y'
				),
				ws_batters AS (
					SELECT playerid, sum(${stat}), count(distinct b.teamid)
					FROM batting b
					JOIN ws_teams w ON b.teamid = w.teamid
					AND b.yearid = w.yearID
					GROUP BY playerid
					HAVING sum(${stat}) > ${num}
					AND count(distinct b.teamid) > 1
				),
				colleges AS (
					SELECT schoolid, count(w.playerid) AS num1
					FROM ws_batters w 
					JOIN collegeplaying c ON w.playerid = c.playerid
					
					GROUP BY schoolid
				)
				SELECT name_full 
				FROM colleges c join schools s on c.schoolid = s.schoolid
				WHERE rownum < 11
				ORDER BY num1 DESC`
				return [question, query]

			case 5 :
				question = `Which ${team} pitcher holds the team record for lowest ERA in a season with over 20 games started?`
				query = `with pitchers AS (
					SELECT p.playerid, min(p.era) AS min_era
					from pitching p
					JOIN teams t ON p.teamid = t.teamid
					WHERE t.name = '${team}'
					AND p.gs > 20
					GROUP BY p.playerid
					ORDER BY min(p.era)
				),
				names AS (
					SELECT concat(concat(namefirst,' '), namelast) AS full_name
					FROM pitchers t JOIN people p 
					ON t.playerid = p.playerid
					ORDER BY min_era ASC
				)
				SELECT full_name from names where rownum < 11`
				return [question, query]

			case 6 :
				question = `Which batter has the most career ${this.json[bat]} of all time?`
				query = `WITH stats as (
					select playerid, sum(${bat}) AS hrs
					FROM batting 
					GROUP BY playerid
				),
				names AS (
					SELECT concat(concat(namefirst,' '), namelast) AS full_name
					FROM stats s JOIN people p
					ON s.playerid = p.playerid
					ORDER BY hrs DESC
				) 
				SELECT full_name from names WHERE ROWNUM < 11`
				return [question, query]
			
			case 7 :
				var decade = parseInt(year / 10, 10) * 10
				question = `Which of these players has the most ${this.json[bat]} for any 
				player born in the ${decade}'s of all time?`
				var decadeLow = decade + '-04-01'
				decade += 10
				var decadeHigh = decade + '-04-01'

				query = `WITH stats as (
					select concat(concat(namefirst,' '), namelast) AS full_name
					FROM people p join batting b on p.playerid = b.playerid
					WHERE birthyear between date '${decadeLow}' and date '${decadeHigh}'
					ORDER BY ${bat} DESC
				)
				select distinct FULL_NAME FROM STATS where rownum < 11`
				return [question, query]

			case 8 :
				var high;
				var low;
				if (year > 1986) {
					high = year
					low = year - 30
				}
				else if (year < 1930) {
					low = year
					high = year + 30
				}
				else {
					low = year - 15
					high = year + 15
				}
				var ws = 'Y'
				var ws_string = 'wins'
				if (Math.random() * 2 == 1) {
					ws = 'N'
					ws_string = 'losses'
				}
				question = `Which team had the most World Series ${ws_string} between ${low} and ${high}?`
				low += '-04-01'
				high += '-04-01'
				query = `WITH ws_winners as (
					select name, count(name) 
					from teams t 
					WHERE wswin = '${ws}'
					AND yearid between date '${low}' and date '${high}'
					GROUP BY NAME
					order by count(name) desc   
				)
				select name FROM ws_winners where rownum < 11`
				return [question, query];

		}
	}
}
export default QuestionGenerator;