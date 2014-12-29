var config = require('../../config/config'),
 _ = require('lodash'),
 gameweekFixturesSelectors = require(config.ROOT +'/app/utilities/selectors/fixtures-gameweek').fixturesGameweek,
 clubDetails = require(config.ROOT +'/app/utilities/club-details'),
 moment = require('moment');



var responseGeneration = {
    buildgameweekFixturesResponse: function (cheerioBody) {
      var $ = cheerioBody,
          gamesInGameweekLength = $(gameweekFixturesSelectors.table).length,
          fixturesArr = [],
          deadline = $(gameweekFixturesSelectors.title).text().split('- ')[1];
      for (i = 1; i <= gamesInGameweekLength; i++) {
        var fixtureRow = _.template(gameweekFixturesSelectors.row,{number:i}),
          fixtureRowSelector = gameweekFixturesSelectors.table + fixtureRow;
          // horrible case as couldn't find: $('table.ismFixtureTable tbody tr.ismFixture:nth-child(2)')
          if ($(fixtureRowSelector).hasClass(gameweekFixturesSelectors.fixture)) {
          var date = $(fixtureRowSelector + gameweekFixturesSelectors.fixtures.date).text()
          obj = {
            date: date,
            home: {
              club: clubDetails.searchForClubDetails($(fixtureRowSelector + gameweekFixturesSelectors.fixtures.home).text(), 'name'),
            },
            away: {
              club: clubDetails.searchForClubDetails($(fixtureRowSelector + gameweekFixturesSelectors.fixtures.away).text(), 'name')
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
        deadline: deadline,
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


