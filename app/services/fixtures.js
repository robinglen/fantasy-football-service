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
      var gamesInGameweekLength = $(gameweekFixturesSelectors.table).length;
      var fixturesArr = [];
      for (i = 1; i <= gamesInGameweekLength; i++) {
        var fixtureRow = _.template(gameweekFixturesSelectors.row,{number:i}),
          fixtureRowSelector = gameweekFixturesSelectors.table + fixtureRow;
          // horrible case as couldn't find: $('table.ismFixtureTable tbody tr.ismFixture:nth-child(2)')
          if ($(fixtureRowSelector).hasClass(gameweekFixturesSelectors.fixture)) {
          obj = {
            date: $(fixtureRowSelector + gameweekFixturesSelectors.fixtures.date).text(),
            home: {
              club: helpers.searchForClubDetails($(fixtureRowSelector + gameweekFixturesSelectors.fixtures.home).text(), 'name'),
            },
            away: {
              club: helpers.searchForClubDetails($(fixtureRowSelector + gameweekFixturesSelectors.fixtures.away).text(), 'name')
            }
          };
          var fixtureScore = collectScoreIfAvailable($(fixtureRowSelector + gameweekFixturesSelectors.fixtures.score).text());
          if(fixtureScore) {
            obj.home.score = fixtureScore.home;
            obj.away.score = fixtureScore.away;
          }
          fixturesArr.push(obj);
        }
      }; 
      return {
        gameweek: Number($(gameweekFixturesSelectors.title).text().split('Gameweek ')[1].split(' -')[0]),
        deadline: $(gameweekFixturesSelectors.title).text().split('- ')[1],
        fixtures:fixturesArr 
      }
    }

  };

function collectScoreIfAvailable(scoreline) {
  if (scoreline === 'v') {
    return false;
  } else {
    var scoreArr = scoreline.split(' - ');
    return {
      home: scoreArr[0],
      away: scoreArr[1]
    }
  }
} 

module.exports = {
    responseGeneration: responseGeneration
};


