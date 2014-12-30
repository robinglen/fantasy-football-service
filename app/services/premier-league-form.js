var config = require('../../config/config');
var cheerio = require('cheerio');
var _ = require('lodash');
var premierLeagueFormSelectors = require(config.ROOT +'/app/utilities/selectors/premier-league-form').premierLeagueForm;
var premierLeagueVariables = require(config.ROOT +'/app/utilities/premier-league-globals').premierLeague;
var helpers = require(config.ROOT +'/app/helpers/index')


  var responseGeneration = {
    buildOverallFormResponse: function (cheerioBody) {
    	var $ = cheerioBody,
    	tableRows = $(premierLeagueFormSelectors.table).length,
    	arr = [];
    	for (i = 1; i <= tableRows; i++) {
        	var formRow = _.template(premierLeagueFormSelectors.row,{number:i}),
        	formRowSelector = premierLeagueFormSelectors.table + formRow,
        	formOverallRow = _.template(premierLeagueFormSelectors.form.row,{number:10}),
        	formOverallRowSelector = formRowSelector + formOverallRow,
        	obj = {
        		club: $(formRowSelector + premierLeagueFormSelectors.team).text(),
        		leaguePosition: Number($(formRowSelector + premierLeagueFormSelectors.leaguePosition).text()),
        		form: {
        			overall: $(formOverallRowSelector).text()
        		}
        	};
        	arr.push(obj)
    	} 
	    return arr
    }
  };



module.exports = {
    responseGeneration: responseGeneration
};

