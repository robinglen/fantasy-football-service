var config = require('../../config/config');
var request = require('request');
var async = require('async');
var cheerio = require('cheerio');
var _ = require('lodash');
var gameweekFixturesSelectors = require(config.ROOT +'/app/utilities/fantasy-selectors').gameweekFixtures;
var helpers = require(config.ROOT +'/app/helpers/index');


// todo need some kind of club look up to get club ID
// need to then add a check to see how we get player data on here
// also how to identify if a club has two games, need wireframe for this really

  var responseGeneration = {
    buildgameweekFixturesResponse: function (cheerioBody) {
      var $ = cheerioBody;
      var gamesInGameweekLength = $(gameweekFixturesSelectors.table).length ;
      var fixturesArr = [];
      for (i = 1; i <= gamesInGameweekLength; i++) {
        var fixtureRow = _.template(gameweekFixturesSelectors.row,{number:i}),
          fixtureRowSelector = gameweekFixturesSelectors.table + fixtureRow,
          obj = {
            date: $(fixtureRowSelector + gameweekFixturesSelectors.fixtures.date).text(),
            home: helpers.searchForClubDetails($(fixtureRowSelector + gameweekFixturesSelectors.fixtures.home).text(), 'name'),
            away: helpers.searchForClubDetails($(fixtureRowSelector + gameweekFixturesSelectors.fixtures.away).text(), 'name')
          };
          fixturesArr.push(obj);
      }; 

      return {
        gameweek: Number($(gameweekFixturesSelectors.title).text().split('Gameweek ')[1].split(' -')[0]),
        deadline: $(gameweekFixturesSelectors.title).text().split('- ')[1],
        fixtures:fixturesArr 
      }
    }

  };

module.exports = {
    responseGeneration: responseGeneration
};


