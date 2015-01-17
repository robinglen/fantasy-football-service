var config = require('../../config/config'),
 _ = require('lodash'),
 gameweekFixturesSelectors = require(config.ROOT +'/app/utilities/selectors/fixtures-gameweek').fixturesGameweek,
 premierLeagueVariables = require(config.ROOT +'/app/utilities/premier-league-globals').premierLeague,
 clubDetails = require(config.ROOT +'/app/utilities/club-details'),
 moment = require('moment');


// I need to add the year into the date format
// if aug to dec start year season
// if after end year season

// need build date functionality

var responseGeneration = {
    buildgameweekFixturesResponse: function (cheerioBody) {
      var $ = cheerioBody,
          gamesInGameweekLength = $(gameweekFixturesSelectors.table).length,
          fixturesArr = [],
          deadline = constructFullDates($(gameweekFixturesSelectors.title).text().split('- ')[1]);
      for (i = 1; i <= gamesInGameweekLength; i++) {
        var fixtureRow = _.template(gameweekFixturesSelectors.row,{number:i}),
          fixtureRowSelector = gameweekFixturesSelectors.table + fixtureRow;
          // horrible case as couldn't find: $('table.ismFixtureTable tbody tr.ismFixture:nth-child(2)')
          if ($(fixtureRowSelector).hasClass(gameweekFixturesSelectors.fixture)) {
          var date = constructFullDates($(fixtureRowSelector + gameweekFixturesSelectors.fixtures.date).text());
          obj = {
            date: date,
            kickoff: moment(date).format('HH:mm'),
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
      var groupMatchesByDateObj = groupMatchesByDate(fixturesArr);
      var flattenMatchesIntoMatchDayArr = flattenMatchesIntoMatchDay(groupMatchesByDateObj); 
      return {
        gameweek: Number($(gameweekFixturesSelectors.title).text().split('Gameweek ')[1].split(' -')[0]),
        deadline: deadline,
        fixtures:flattenMatchesIntoMatchDayArr 
      }
    }

  };



function constructFullDates(dateString) {
  var month = Number(moment(dateString, 'DD MMM hh:mm').format('M'));
  var lastMonthOfSeason = Number(moment(premierLeagueVariables.season.end.month, 'MMM').format('M'));
  var year = premierLeagueVariables.season.start.year;
  if(month<=lastMonthOfSeason) {
    year = premierLeagueVariables.season.end.year;
  }
  var longDate = moment(dateString, 'DD MMM hh:mm').year(year).format();
  return longDate;
} 

function flattenMatchesIntoMatchDay(groupMatchesByDateObj) {
  var collectMatchDaysTogetherArr = [];
  var matchDayKeys = _.keys(groupMatchesByDateObj);
  matchDayKeys.forEach(function(date){
    var obj = {
      matchDay: moment(date,'MMMDD').format('dddd MMMM Do'),
      matches: groupMatchesByDateObj[date]
    }
    collectMatchDaysTogetherArr.push(obj);
  })
  return collectMatchDaysTogetherArr;
} 


function groupMatchesByDate(fixturesArr) {
  var matchDayObj = {};
  fixturesArr.forEach(function(match){
    var shortDate = moment(match.date).format('MMMDD');
    if (_.has(matchDayObj, shortDate)) {
      matchDayObj[shortDate].push(match);
    } else {
      matchDayObj[shortDate] = [match];
    }
  })
  return matchDayObj;
} 


function findLastFixtureInAGameweek(fixturesObj) {
  var lastMatchDay = _.last(fixturesObj.fixtures);
  var lastMatch = _.last(lastMatchDay.matches);
  return lastMatch.date;
} 


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
    responseGeneration: responseGeneration,
    findLastFixtureInAGameweek:findLastFixtureInAGameweek
};


