
class QuestionGenerator {

	var stats = [];
	var years = [];
	var teams = [];

	constructor() {
		this.stats = getStatOptions();
		this.years = getYearOptions();
		this.teams = getTeamOptions();  
	}

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

		String question = "";
		String query = "";

		switch(questionIndex) {
		  	case 0:
		  		question = "Which player had the most " + statIndex + " in " + yearIndex + "?"
		    	return []
		    	break;
		  	case 1:
		    	question = "Which player had the fewest " + statIndex + " in " + yearIndex + "?"
		   		break;
	   		case 2:
		    
		   		break;
	   		case 3:

		   		break;
	   		case 4:

		   		break;
	   		case 5:

		   		break;
		  	default:

		}
		
	}



}