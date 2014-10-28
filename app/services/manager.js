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
      var seasonHistoryLength = $(mangerOverviewSelectors.gameweekOverviewTable).length -1, 
          gameWeek = [],
          weeklyPoints = [],
          totalTransfers = [],
          totalTransfersCosts = [],
          collectOverview = collectManagerOverview($);
          collectGameWeekData = collectGameWeekRelated($,managerId,seasonHistoryLength);
          console.log(collectOverview)
      /*
      return {
        manager: collectOverview.manager,
        team: collectOverview.team,
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
          url: buildTransferHistoryURL(managerID)
        },
        thisSeason : collectGameWeekData.thisSeason,
        previousSeasons: collectCareerHistory($)
      }
      */
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

function collectGameWeekRelated ($,managerID,seasonHistoryLength) {
  var gameWeek = []
      weeklyPoints = 0
      totalTransfers = 0
      totalTransfersCosts = 0;
      collectOverview = collectManagerOverview($);
 
  // map each team to an object
  for (i = 1; i <= seasonHistoryLength; i++) { 
    var gameweekRow = _.template(mangerOverviewSelectors.gameweekOverviewTableRow,{number:i});

  //   var element = '.ismPrimaryNarrow section:nth-of-type(1) table tr:nth-child(' + i +')';
  //   weeklyPoints = weeklyPoints + Number($(element + ' td.ismCol2').text());
  //   totalTransfers= totalTransfers + Number($(element + ' td.ismCol4').text());
  //   totalTransfersCosts= totalTransfersCosts +Number($(element + ' td.ismCol5').text());
  //   var obj = {
  //     title: $(element + ' td.ismCol1').text(),
  //     gameWeekPoints: Number($(element + ' td.ismCol2').text()),
  //     gameWeekRank: $(element + ' td.ismCol3').text(),
  //     transfersMade: Number($(element + ' td.ismCol4').text()),
  //     transfersCost: Number($(element + ' td.ismCol5').text()),
  //     teamValue: $(element + ' td.ismCol6').text(),
  //     overallPoints: Number($(element + ' td.ismCol7').text()),
  //     overallRank: $(element + ' td.ismCol8').text(),
  //     positionMovement: checkPositionMovement($(element + ' td.ismCol9 img').attr('src')),
  //     url: buildGameweekOverviewURL(managerID,i)
  //   }
  //   gameWeek.push(obj)
  // }
  // return {
  //   transfersMade: totalTransfers,
  //   transfersCost: totalTransfersCosts,
  //   averagePoints: (weeklyPoints/seasonHistoryLength).toFixed(0),
  //   overallPoints: gameWeek[seasonHistoryLength-1].overallPoints,
  //   overallRank: gameWeek[seasonHistoryLength-1].overallRank,
  //   positionMovement: gameWeek[seasonHistoryLength-1].positionMovement,
  //   teamValue:gameWeek[seasonHistoryLength-1].teamValue,
  //   thisSeason : gameWeek,
   }  
}

// /**
//  * @param  {string} managerID
//  */
// function buildTransferHistoryURL(managerID) {
//   return config.URL + '/fantasy/manager/' + managerID + '/transfers';
// }


// function collectCareerHistory ($) {
//   var careerHistory =[];
//   var careerHistoryLength = $('.ismPrimaryNarrow section:nth-of-type(2) table tr').length -1;
//   for (i = 1; i <= careerHistoryLength; i++) {
//     var element = '.ismPrimaryNarrow section:nth-of-type(2) table tr:nth-child(' + i +')';
//     var obj = {
//         season: $(element + ' td.ismCol1').text(),
//         points: $(element + ' td.ismCol2').text(),
//         rank: $(element + ' td.ismCol3').text()
//     }
//     careerHistory.push(obj); 
//   }
//   return careerHistory;
// }

// /**
//  * @param  {string} href
//  */
// function buildGameweekOverviewURL(managerID,gameweek) {
//   return config.URL + '/fantasy/manager/' + managerID + '/gameweek/' + gameweek;
// }


// /**
//  * @param  {string} imageURL
//  */
// function checkPositionMovement (imageURL) {

//   switch (imageURL) {
//     case "http://cdn.ismfg.net/static/img/new.png":
//       return "-"
//     case "http://cdn.ismfg.net/static/img/up.png":
//       return "up"
//     case "http://cdn.ismfg.net/static/img/down.png":
//       return "down"
//     default:
//       return "-"
//   }
// }
