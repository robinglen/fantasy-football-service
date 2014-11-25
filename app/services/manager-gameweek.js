var config = require('../../config/config');
var cheerio = require('cheerio');
var _ = require('lodash');
var managerGameweekSelectors = require(config.ROOT +'/app/utilities/fantasy-selectors').managerGameweek;
var premierLeagueVariables = require(config.ROOT +'/app/utilities/premier-league-globals').premierLeague;
var managerOverviewService = require(config.ROOT +'/app/services/manager-overview');
var helpers = require(config.ROOT +'/app/helpers/index')


  var responseGeneration = {
    buildManagerGameweekResponse: function (cheerioBody,managerId, gameweek) {
      var $ = cheerioBody;
      var collectOverview = managerOverviewService.responseGeneration.collectManagerOverview($);
      var gameweekPoints = Number($(managerGameweekSelectors.gameweekPoints.selector).text().split(managerGameweekSelectors.gameweekPoints.split)[0]);
      var gameweekAveragePoints = Number($(managerGameweekSelectors.gameweekAveragePoints.selector).text().split(managerGameweekSelectors.gameweekAveragePoints.split)[0]);
      var gameweekHighestPoints = Number($(managerGameweekSelectors.gameweekHighestPoints.selector).text().split(managerGameweekSelectors.gameweekHighestPoints.split)[0]);
      var teamSheet = buildTeamLineUp($(managerGameweekSelectors.teamSheet.pitch).html());
      return {
        manager: collectOverview.manager,
        team: collectOverview.team,
        gameweekPoints: gameweekPoints,
        gameweekAveragePoints:gameweekAveragePoints,
        gameweekHighestPoints:gameweekHighestPoints,
        teamSheet: teamSheet  
      }
    }
  };

function buildTeamLineUp (pitchHTML) {
  var $ = cheerio.load(pitchHTML);
  var goalkeeper = buildPlayerObject($(managerGameweekSelectors.teamSheet.goalkeeper).html());
  var defence = collectPlayersInPosition($(managerGameweekSelectors.teamSheet.defence).html());
  var midfield = collectPlayersInPosition($(managerGameweekSelectors.teamSheet.midfield).html());
  var attack = collectPlayersInPosition($(managerGameweekSelectors.teamSheet.attack).html());
  var bench = collectPlayersInPosition($(managerGameweekSelectors.teamSheet.bench).html());
  return {
    goalkeeper: goalkeeper,
    defence:defence,
    midfield:midfield,
    attack: attack,
    bench: bench
  }
}

function collectPlayersInPosition (pitchRowHTML) {
  var $ = cheerio.load(pitchRowHTML);
  var positionArr = [];
  $(managerGameweekSelectors.teamSheet.player.cell).each(function(i, elem) {
    if ($(this)[0].children.length>0) {
      positionArr.push(buildPlayerObject($(this).html()));
    }
  });
  return positionArr;
}

function buildPlayerObject (positionHTML) {
  var $ = cheerio.load(positionHTML);
    var classObj = JSON.parse($(managerGameweekSelectors.teamSheet.player.json.selector).attr('class').split(managerGameweekSelectors.teamSheet.player.json.split)[1]);
    // If this "object" class disapears can get by these classes
      /*
      points: Number($('.ismElementDetail .ismPitchStat').text()),
      captain: $('.JS_ISM_CAPTAIN .ismCaptain').hasClass('ismCaptainOn'),
      viceCaptain: $('.JS_ISM_CAPTAIN .ismViceCaptain').hasClass('ismViceCaptainOn'),
      */
    return {
      id: classObj.id,
      // this ID can be used to get player data: http://fantasy.premierleague.com/web/api/elements/522/
      name: $(managerGameweekSelectors.teamSheet.player.name).text().trim(),
      points: classObj.event_points,
      club: {
        code: classObj.team,
        name: $(managerGameweekSelectors.teamSheet.player.club.name).attr('title')
      },
      captain: classObj.is_captain,
      viceCaptain: classObj.is_vice_captain,
      dreamteam: $(managerGameweekSelectors.teamSheet.player.dreamteam.selector).hasClass(managerGameweekSelectors.teamSheet.player.dreamteam.hasClass)   
    }
}

module.exports = {
    responseGeneration: responseGeneration
};

