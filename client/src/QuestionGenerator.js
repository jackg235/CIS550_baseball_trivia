
class QuestionGenerator {

	stats = [];
	years = [];
	teams = [];

	constructor() {
		this.stats = getStatOptions(git );
		this.years = getYearOptions();
		this.teams = getTeamOptions();  
	}

	// TODO get these from database call
	getStatOptions() {
		return ["STAT1", "STAT2"]
	}

	getYearOptions() {
		return ["YEAR1", "YEAR2"]
	}

	getTeamOptions() {
		return ["TEAM1", "TEAM2"]
	}

	generateQuestion() {
		var statIndex = Math.randomInt(0, this.stats.length());
		var yearIndex = Math.randomInt(0, this.years.length());
		var teamIndex = Math.randomInt(0, this.teams.length());
		var questionIndex = Math.randomInt(0, 6);

		var stat = this.stats[statIndex];
		var year = this.years[yearIndex];
		var team = this.teams[teamIndex];

		var question = "";
		var query = "";

		switch(questionIndex) {
		  	case 0:
		  		question = "Which player had the most ${stat} in ${year}?"
		  		query = "WITH Stat AS (" +
							"SELECT name, ${stat}" +
							"FROM Batting" +
							"WHERE yearID == ${year}" +
						"SELECT name, MAX(${stat})" +
						"FROM Stat" +
						"GROUP BY ${stat}"
						"HAVING ROWNUM == 1"

		    	return [question, query]
		    	break;
		  	case 1:
		    	question = "Which player had the fewest ${stat} in ${year}?"
		    	query = "WITH Stat AS (" +
							"SELECT name, ${stat}" +
							"FROM Batting" +
							"WHERE yearID == ${year}" +
						"SELECT name, MIN(${stat})" +
						"FROM Stat" +
						"GROUP BY ${stat}"
						"HAVING ROWNUM == 1"

		    	return [question, query]
		   		break;
	   		case 2:
		    	question = "Which pitcher had the most ${stat} in ${year}?"
				query = "WITH Stat AS (" +
							"SELECT name, ${stat}" +
							"FROM Pitching" +
							"WHERE yearID == ${year}" +
						"SELECT name, MAX(${stat})" +
						"FROM Stat" +
						"GROUP BY ${stat}"
						"HAVING ROWNUM == 1"

		    	return [question, query]
		   		break;
	   		case 3:
	   			question = "Which pitcher had the fewest ${stat} in ${year}?"
	   			query = "WITH Stat AS (" +
							"SELECT name, ${stat}" +
							"FROM Pitching" +
							"WHERE yearID == ${year}" +
						"SELECT name, MIN(${stat})" +
						"FROM Stat" +
						"GROUP BY ${stat}"
						"HAVING ROWNUM == 1"

	   			return [question, query]
		   		break;
	   		case 4:
				question = "Which {team} player holds the team record for the most ${stat} in a World Series?"
				query = "SELECT name, MAX(${stat})" +
						"FROM world_series_batting" + 
						"WHERE TEAM = ${team}" +
						"GROUP BY name" +
						"HAVING ROWNUM == 1"

	   			return [question, query]
		   		break;
	   		case 5:
	   			question = "Who is the lightest player to hit 50 home-runs in a season?";
	   			query = "WITH Weights AS (" +
							"SELECT playerID, nameFirst, nameLast, weight" +
							"FROM People)" +
						"SELECT nameFirst, nameLast, MIN(weight)" +
						"FROM Weights w JOIN Batting b ON b.playerID == w.playerID" +
						"GROUP BY weight" +
						"HAVING HR > 50";
	   			return [question, query]
				break;
				 
			case 6:
				question = "Which state has produced the most professional players?"
				query = "SELECT birthState, COUNT(birthState)" +
						"FROM People" +
						"GROUP BY birthState" +
						"SORT BY COUNT(birthState) ASC" + 
						"HAVING ROWNUM == 1"

				return [question, query]
				break;

		  	default:

		}
	}
}