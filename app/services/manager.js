var config = require('../../config/config');
var request = require('request');
var async = require('async');
var cheerio = require('cheerio');
var _ = require('lodash');
var mangerOverviewSelectors = require(config.ROOT +'/app/utilities/fantasy-selectors').managerOverview;


var utilities = {

    generateURL: function(locals) {
      switch(locals.request) {
        case 'transfers':
          // in and out -  include player ID in response, get from href
          url = _.template('http://fantasy.premierleague.com/entry/<%= managerId %>/transfers/history/');
          break;
        case  'overview':
          // historic data, data about manger, team supported, country etc
          url = _.template('http://fantasy.premierleague.com/entry/<%= managerId %>/history/');
          break;
        case  'gameweek':
          // all information about the week, link to players
          url = _.template('http://fantasy.premierleague.com/entry/<%= managerId %>/event-history/<%= gameweek %>');
          break;
        }
      return  url({ 'managerId': locals.managerId, 'gameweek':locals.gameweek });
    }
};


  var responseGeneration = {
    buildManagerOverviewResponse: function (cheerioBody,managerId) {
      var $ = cheerioBody;
      var seasonHistoryLength = $(mangerOverviewSelectors.gameweekOverview.table).length -1, 
          gameWeek = [],
          weeklyPoints = [],
          totalTransfers = [],
          totalTransfersCosts = [],
          collectOverview = collectManagerOverview($);
          collectGameWeekData = collectGameWeekRelated($,managerId,seasonHistoryLength);
      return {
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
          transfersCost:collectGameWeekData.transfersCost,
          url: buildTransferHistoryURL(managerId)
        },
        thisSeason : collectGameWeekData.thisSeason,
        previousSeasons: collectCareerHistory($)
      }
    }
  };

module.exports = {
    utilities:utilities,
    responseGeneration: responseGeneration
};







function collectManagerOverview ($) {
  return {
    manager: $(mangerOverviewSelectors.managerName).text(),
    team: $(mangerOverviewSelectors.teamName).text(),  
    overallPoints: $(mangerOverviewSelectors.overallPoints).text(), 
    overallRank: $(mangerOverviewSelectors.overallRank).text() 
  }
}

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
          positionMovement: checkPositionMovement($(gameWeekRowSelector + mangerOverviewSelectors.gameweekOverview.position.img).attr('src')),
          url: buildGameweekOverviewURL(managerId,i)
        };
    weeklyPoints = weeklyPoints + obj.gameWeekPoints;
    totalTransfers= totalTransfers + obj.transfersMade;
    totalTransfersCosts= totalTransfersCosts + obj.transfersCost;
    gameWeek.push(obj);
  }
  return {
    transfersMade: totalTransfers,
    transfersCost: totalTransfersCosts,
    averagePoints: (weeklyPoints/seasonHistoryLength).toFixed(0),
    overallPoints: gameWeek[seasonHistoryLength-1].overallPoints,
    overallRank: gameWeek[seasonHistoryLength-1].overallRank,
    positionMovement: gameWeek[seasonHistoryLength-1].positionMovement,
    teamValue:gameWeek[seasonHistoryLength-1].teamValue,
    thisSeason : gameWeek,
   }  
}

/**
 * @param  {string} managerID
 */
function buildTransferHistoryURL(managerId) {
  return config.URL + '/fantasy/manager/' + managerId + '/transfers';
}


function collectCareerHistory ($) {
  var careerHistory =[];
  var careerHistoryLength = $(mangerOverviewSelectors.careerHistory.table).length -1;
  for (i = 1; i <= careerHistoryLength; i++) {

    var careerHistoryRow = _.template(mangerOverviewSelectors.careerHistory.row,{number:i}),
        careerHistorySelector = mangerOverviewSelectors.careerHistory.table + careerHistoryRow,
        obj = {
          season: $(careerHistorySelector + mangerOverviewSelectors.careerHistory.season).text(),
          points: $(careerHistorySelector + mangerOverviewSelectors.careerHistory.points).text(),
          rank: $(careerHistorySelector + mangerOverviewSelectors.careerHistory.rank).text()
        };
    careerHistory.push(obj); 
  }
  return careerHistory;
}

/**
 * @param  {string} href
 */
function buildGameweekOverviewURL(managerId,gameweek) {
  return config.URL + '/fantasy/manager/' + managerId + '/gameweek/' + gameweek;
}


/**
 * @param  {string} imageURL
 */
function checkPositionMovement (imageURL) {
  switch (imageURL) {
    case mangerOverviewSelectors.gameweekOverview.position.unchanged:
      return "-"
    case mangerOverviewSelectors.gameweekOverview.position.up:
      return "up"
    case mangerOverviewSelectors.gameweekOverview.position.down:
      return "down"
    default:
      return "-"
  }
}
