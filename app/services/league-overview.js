var config = require('../../config/config');
var request = require('request');
var async = require('async');
var cheerio = require('cheerio');
var _ = require('lodash');
var leagueOverviewSelectors = require(config.ROOT +'/app/utilities/fantasy-selectors').leagueOverview;
var helpers = require(config.ROOT +'/app/helpers/index');
var fantasySelectorsHelpers = require(config.ROOT +'/app/helpers/fantasy-selectors');


  var responseGeneration = {
    buildleagueOverviewResponse: function (cheerioBody,leagueId) {
      var $ = cheerioBody;
      var tableRows = $(leagueOverviewSelectors.table).length + 1;
      var arr = [];
      // map each team to an object
      for (i = 3; i <= tableRows; i++) { 
        var leagueRow = _.template(leagueOverviewSelectors.row,{number:i}),
          leagueRowSelector = leagueOverviewSelectors.table + leagueRow,
          obj = {
            positionMovement: fantasySelectorsHelpers.checkPositionMovement($(leagueRowSelector + leagueOverviewSelectors.position.img).attr('src'),leagueOverviewSelectors.position),
            team: $(leagueRowSelector + leagueOverviewSelectors.team).text(), 
            manager: {
              name: $(leagueRowSelector + leagueOverviewSelectors.manager.name).text(),
              id: getCodeFromURL($(leagueRowSelector + leagueOverviewSelectors.manager.code).attr('href'))
            },
            gameWeek: Number($(leagueRowSelector + leagueOverviewSelectors.gameweek).text()),
            total: Number($(leagueRowSelector + leagueOverviewSelectors.total).text()),
          }
        arr.push(obj)
      }
      return {
        title: $(leagueOverviewSelectors.title).text(),
        id: leagueId,
        teams: arr
      }
    }

  };

module.exports = {
    responseGeneration: responseGeneration
};

function getCodeFromURL(href) {
  return href.split('/entry/')[1].split('/')[0];
}

