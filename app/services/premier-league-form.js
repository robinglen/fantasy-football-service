var config = require('../../config/config');
var cheerio = require('cheerio');
var _ = require('lodash');
var premierLeagueFormSelectors = require(config.ROOT +'/app/utilities/selectors/premier-league-form').premierLeagueForm;
var clubDetails = require(config.ROOT +'/app/utilities/club-details');
var helpers = require(config.ROOT +'/app/helpers/index');

 var responseGeneration = {
    buildOverallFormResponse: function (cheerioBody) {
    	var $ = cheerioBody,
    	tableRows = $(premierLeagueFormSelectors.table).length,
    	arr = [];
    	for (var i = 1; i <= tableRows; i++) {
        	var formRow = _.template(premierLeagueFormSelectors.row,{number:i}),
        	formRowSelector = premierLeagueFormSelectors.table + formRow,
        	// if we wanted to add home and away form we could do this with the adding row numbers:
        	// home - 6
        	// away - 8
        	formOverallRow = _.template(premierLeagueFormSelectors.form.row,{number:10}),
        	formOverallRowHTML = $(formRowSelector + formOverallRow).html(),
        	overallFormMatchBreakDown = generateMatchReports(formOverallRowHTML),
        	obj = {
        		club: clubDetails.searchForClubDetails($(formRowSelector + premierLeagueFormSelectors.team).text(), 'name'),
        		leaguePosition: Number($(formRowSelector + premierLeagueFormSelectors.leaguePosition).text()),
        		form: {
        			overall: overallFormMatchBreakDown
        		}
        	};
        	arr.push(obj)
    	} 
	    return arr
    }
  };

// passing flat HTML and then reconverting to cheerio object is way faster than passing
// object and searching again - refactor like this in other places 
function generateMatchReports (formRowHTML) {
	var $ = cheerio.load(formRowHTML);
	var matchReportArr = [],
		matchSelector = premierLeagueFormSelectors.form.matches,
		matches = $(matchSelector).length;
	for (var j = 0; j < matches; j++) {
		var obj = {
			status: $(matchSelector)[j].attribs.class,
			opponent: clubDetails.searchForClubDetails($(matchSelector)[j].attribs.clubname, 'name'),
			played: convertPlayedLocationToWord($(matchSelector)[j].attribs.homeaway),
			score: $(matchSelector)[j].attribs.score
		}
		matchReportArr.push(obj);
	}
	return matchReportArr

}

function convertPlayedLocationToWord (homeawayCharacter) {
	if (homeawayCharacter==="H") {
		return "Home"
	} else {
		return "Away"
	}
}




module.exports = {
    responseGeneration: responseGeneration
};

