var config = require('../../config/config');
var request = require('request');
var async = require('async');
var cheerio = require('cheerio');
var _ = require('lodash');
var mangerOverviewSelectors = require(config.ROOT +'/app/utilities/fantasy-selectors').managerOverview;
var premierLeagueVariables = require(config.ROOT +'/app/utilities/premier-league-globals').premierLeague;
var helpers = require(config.ROOT +'/app/helpers/index')


  var responseGeneration = {
    buildManagerOverviewResponse: function (cheerioBody,managerId) {
      var $ = cheerioBody;
      var seasonHistoryLength = $(mangerOverviewSelectors.gameweekOverview.table).length -1, 
          gameWeek = [],
          weeklyPoints = [],
          totalTransfers = [],
          totalTransfersCosts = [],
          collectOverview = collectManagerOverview($);
          collectGameWeekData = collectGameWeekRelated($,managerId,seasonHistoryLength),
          collectCareerHistoryObj = collectCareerHistory($);
      return {
        id:managerId,
        manager: collectOverview.manager,
        team: collectOverview.team,
        gameweek: seasonHistoryLength,
        averagePoints:collectGameWeekData.averagePoints,
        overall : {
          points:collectOverview.overallPoints,
          rank:collectOverview.overallRank,
          rankPosition:collectGameWeekData.thisSeason[seasonHistoryLength-1].positionMovement,
          teamValue:collectGameWeekData.thisSeason[seasonHistoryLength-1].teamValue,
        },
        transfers :{
          transfersMade:collectGameWeekData.transfersMade,
          transfersCost:collectGameWeekData.transfersCost
        },
        leagues: collectClassicLeagues($),
        thisSeason : collectGameWeekData.thisSeason,
        careerHistory: collectCareerHistoryObj
      }
    }
  };

module.exports = {
    responseGeneration: responseGeneration
};


function collectClassicLeagues ($) {
  var leagues = [];
  var leaguesTableLength = $(mangerOverviewSelectors.classicLeagues.table).length -1;
  for (i = 1; i <= leaguesTableLength; i++) { 
    var leagueRow = _.template(mangerOverviewSelectors.classicLeagues.row,{number:i}),
        leagueRowSelector = mangerOverviewSelectors.classicLeagues.table + leagueRow,
        obj = {
          name: $(leagueRowSelector + mangerOverviewSelectors.classicLeagues.league).text(),
          position: $(leagueRowSelector + mangerOverviewSelectors.classicLeagues.position.rank).text(),
          positionMovement: checkPositionMovement($(leagueRowSelector + mangerOverviewSelectors.classicLeagues.position.img).attr('src'),mangerOverviewSelectors.classicLeagues.position),
          code: helpers.collectCodeFromUrl($(leagueRowSelector + mangerOverviewSelectors.classicLeagues.league).attr('href'),'/my-leagues/')
        };
    leagues.push(obj)
  }
  return leagues;
}




function collectManagerOverview ($) {
  return {
    manager: $(mangerOverviewSelectors.managerName).text(),
    team: $(mangerOverviewSelectors.teamName).text(),  
    overallPoints: Number($(mangerOverviewSelectors.overallPoints).text()), 
    overallRank: $(mangerOverviewSelectors.overallRank).text() 
  }
}


// transgers made cones't include wildcard transfers
function collectGameWeekRelated ($,managerId,seasonHistoryLength) {
  var gameWeek = []
      weeklyPoints = 0
      totalTransfers = 0
      totalTransfersCosts = 0;
      collectOverview = collectManagerOverview($);
 
  // map each team to an object
  for (i = 1; i <= seasonHistoryLength; i++) { 
    var gameweekRow = _.template(mangerOverviewSelectors.gameweekOverview.row,{number:i}),
        gameWeekRowSelector = mangerOverviewSelectors.gameweekOverview.table + gameweekRow,
    
        obj = {
          title: $(gameWeekRowSelector + mangerOverviewSelectors.gameweekOverview.title).text(),
          gameWeekPoints: Number($(gameWeekRowSelector + mangerOverviewSelectors.gameweekOverview.points).text()),
          gameWeekRank: $(gameWeekRowSelector + mangerOverviewSelectors.gameweekOverview.rank).text(),
          transfersMade: Number($(gameWeekRowSelector + mangerOverviewSelectors.gameweekOverview.transfers).text()),
          transfersCost: Number($(gameWeekRowSelector + mangerOverviewSelectors.gameweekOverview.transfersCosts).text()),
          teamValue: $(gameWeekRowSelector + mangerOverviewSelectors.gameweekOverview.value).text(),
          overallPoints: Number($(gameWeekRowSelector + mangerOverviewSelectors.gameweekOverview.overallPoints).text()),
          overallRank: $(gameWeekRowSelector + mangerOverviewSelectors.gameweekOverview.overallRank).text(),
          positionMovement: checkPositionMovement($(gameWeekRowSelector + mangerOverviewSelectors.gameweekOverview.position.img).attr('src'),mangerOverviewSelectors.gameweekOverview.position)
        };
    weeklyPoints = weeklyPoints + obj.gameWeekPoints;
    totalTransfers= totalTransfers + obj.transfersMade;
    totalTransfersCosts= totalTransfersCosts + obj.transfersCost;
    gameWeek.push(obj);
  }
  return {
    transfersMade: totalTransfers,
    transfersCost: totalTransfersCosts,
    averagePoints: Number((weeklyPoints/seasonHistoryLength).toFixed(0)),
    overallPoints: gameWeek[seasonHistoryLength-1].overallPoints,
    overallRank: gameWeek[seasonHistoryLength-1].overallRank,
    positionMovement: gameWeek[seasonHistoryLength-1].positionMovement,
    teamValue:gameWeek[seasonHistoryLength-1].teamValue,
    thisSeason : gameWeek,
   }  
}

function collectCareerHistory ($) {
  var careerHistory =[];
  var careerHistoryObj ={};
  var careerHistoryLength = $(mangerOverviewSelectors.careerHistory.table).length -1;
  for (i = 1; i <= careerHistoryLength; i++) {
    var careerHistoryRow = _.template(mangerOverviewSelectors.careerHistory.row,{number:i}),
        careerHistorySelector = mangerOverviewSelectors.careerHistory.table + careerHistoryRow,
        obj = {
          season: $(careerHistorySelector + mangerOverviewSelectors.careerHistory.season).text(),
          points:  Number($(careerHistorySelector + mangerOverviewSelectors.careerHistory.points).text()),
          rank: $(careerHistorySelector + mangerOverviewSelectors.careerHistory.rank).text()
        };
    obj.averagePoints =  Number((obj.points/premierLeagueVariables.globals.gameweeks).toFixed(0));
    careerHistory.push(obj); 
  }
  if (careerHistory.length>0) {
    careerHistoryObj = {
      careerAverage: Number(calculateCareerAverage(careerHistory)),
      previousSeasons:careerHistory     
    }
  }
  return careerHistoryObj
}

function calculateCareerAverage (careerHistoryArr) {
  var totalPoints = 0;
  var totalGameWeeks = careerHistoryArr.length * premierLeagueVariables.globals.gameweeks;
  careerHistoryArr.forEach(function(season){
    totalPoints = totalPoints + season.points;
  })
  return (totalPoints/totalGameWeeks).toFixed(0)
}



/**
 * @param  {string} imageURL
 */
function checkPositionMovement (imageURL,postionObj) {
  switch (imageURL) {
    case postionObj.unchanged:
      return "-"
    case postionObj.up:
      return "up"
    case postionObj.down:
      return "down"
    default:
      return "-"
  }
}
