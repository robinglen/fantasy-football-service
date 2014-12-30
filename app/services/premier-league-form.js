var config = require('../../config/config');
//var cheerio = require('cheerio');
//var _ = require('lodash');
//var managerGameweekSelectors = require(config.ROOT +'/app/utilities/fantasy-selectors').managerGameweek;
//var premierLeagueVariables = require(config.ROOT +'/app/utilities/premier-league-globals').premierLeague;
//var helpers = require(config.ROOT +'/app/helpers/index')


  var responseGeneration = {
    buildOverallFormResponse: function (cheerioBody) {
      return {
        manager: 'form will go here'
      }
    }
  };



module.exports = {
    responseGeneration: responseGeneration
};

