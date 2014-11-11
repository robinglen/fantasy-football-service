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
      var fixturesArr = []
      for (i = 1; i <= gamesInGameweekLength; i++) {
        var fixtureRow = _.template(gameweekFixturesSelectors.row,{number:i}),
          fixtureRowSelector = gameweekFixturesSelectors.table + fixtureRow,
          obj = {
            date: $(fixtureRowSelector + gameweekFixturesSelectors.fixtures.date).text(),
            home: {
              name: $(fixtureRowSelector + gameweekFixturesSelectors.fixtures.home).text(),
              id:'needs look up'
            },
            away: {
              name: $(fixtureRowSelector + gameweekFixturesSelectors.fixtures.away).text(),
              id:'needs look up'              
            }
          };
          fixturesArr.push(obj);
      }; 

      return {
        title: $(gameweekFixturesSelectors.title).text(),
        fixtures:fixturesArr 
      }
    }

  };

module.exports = {
    responseGeneration: responseGeneration
};


