var config = require('../../config/config');
var request = require('request');
var async = require('async');
var cheerio = require('cheerio');
var _ = require('lodash');
var mangerTransfersSelectors = require(config.ROOT +'/app/utilities/fantasy-selectors').managerTransfers;
var premierLeagueVariables = require(config.ROOT +'/app/utilities/premier-league-globals').premierLeague;
var managerOverviewService = require(config.ROOT +'/app/services/manager-overview');
var helpers = require(config.ROOT +'/app/helpers/index')


  var responseGeneration = {
    buildManagerTransfersResponse: function (cheerioBody,managerId) {
      var $ = cheerioBody;
      var wildCardObj = collectWildCard($)

      var transferHistoryLength = $(mangerTransfersSelectors.transferHistory.table).length -1;
      var transfers = [];
      var collectOverview = managerOverviewService.responseGeneration.collectManagerOverview($);
      for (i = 1; i <= transferHistoryLength; i++) { 
        var transferHistoryRow = _.template(mangerTransfersSelectors.transferHistory.row,{number:i});
        var obj = {
          date: $(mangerTransfersSelectors.transferHistory.table + transferHistoryRow + mangerTransfersSelectors.transferHistory.date).text(),
          playerOut: $(mangerTransfersSelectors.transferHistory.table + transferHistoryRow + mangerTransfersSelectors.transferHistory.playerOut).text(),
          playerIn: $(mangerTransfersSelectors.transferHistory.table + transferHistoryRow + mangerTransfersSelectors.transferHistory.playerIn).text(),
          gameWeek: $(mangerTransfersSelectors.transferHistory.table + transferHistoryRow + mangerTransfersSelectors.transferHistory.gameWeek).text()
        }
        transfers.push(obj);
      }
      var groupedTransfers = groupTransfers(transfers);
      var playedWildCard;
      if (wildCardObj) {
        playedWildCard = true;
        wildCardObj.forEach(function(wildcard){
          groupedTransfers[wildcard-1].wildcard = true;
        })
      } else {
        playedWildCard= false;
      }
      var transfersWithCostings = calculateGameweekTransferCost(groupedTransfers);
      var overall = transferOverall(transfersWithCostings);
      return {
        manager: collectOverview.manager,
        playedWildcard:playedWildCard,
        team: collectOverview.team,
        overall: {
          totalTransfers:overall.totalTransfers,
          totalCosts:overall.totalCosts
        },
        transfers: transfersWithCostings    
      }
    }
  };


function transferOverall (transfersWithCostingsArr) {
  var totalTransfers = 0;
  var totalCosts = 0;
  transfersWithCostingsArr.forEach(function(gameweek){
    totalTransfers = totalTransfers + gameweek.players.length;
    totalCosts = totalCosts + gameweek.cost;
  });
  return {
    totalTransfers:totalTransfers,
    totalCosts:totalCosts
  }
}



function howManyFreeTransfersAreAvailable (previousWeeksTransfers, gameweek) {
  if (gameweek >2 && previousWeeksTransfers === 0) {
    return 2
  } else {
    return 1
  }
}


// this could be replaced with an aggreation of the manger overview in the future
function calculateGameweekTransferCost (transferHistoryArr) {
  var previousWeeksTransfers = 0;
  var transferHistoryWithCost = [];
  transferHistoryArr.forEach(function(gameweek){
    var weeksTransfers = gameweek.players.length;
    var freeTransfers = howManyFreeTransfersAreAvailable(previousWeeksTransfers, gameweek.gameWeek);
    if (!gameweek.wildcard) {
      var cost = (gameweek.players.length - freeTransfers) * premierLeagueVariables.globals.transferCosts
      gameweek.cost = (cost < 0 ? 0 : cost);
    } else {
      gameweek.cost = 0;
    }
    transferHistoryWithCost.push(gameweek);
    previousWeeksTransfers = gameweek.players.length;
  });
  return transferHistoryWithCost;
}




function groupTransfers (transfersArr) {
  var gameWeeks=[];
  transfersArr.forEach(function(transfer) {
    if (gameWeeks[transfer.gameWeek]) {
      gameWeeks[transfer.gameWeek].players.push({
          out:  transfer.playerOut,
          in:  transfer.playerIn, 
      });
    } else {
    gameWeeks[transfer.gameWeek] = {
      title: 'Game week ' + transfer.gameWeek,
      gameWeek: Number(transfer.gameWeek),
      players: [{
        out:  transfer.playerOut,
        in:  transfer.playerIn,
      }]
    };
    }
  });
  
  var normalisedArr = populateEmptyTransfers(gameWeeks);
  return normalisedArr;
}


function populateEmptyTransfers(groupTransfersArr) {
  groupTransfersArr.splice(0, 1);
  var normalisedArr=[];
  for (i = 0; i < groupTransfersArr.length; i++) { 

    if (groupTransfersArr[i] && groupTransfersArr[i].gameWeek) {
      normalisedArr.push(groupTransfersArr[i])
    } else {
      normalisedArr.push({
        title: 'Game week ' + (i+1),
        gameWeek: (i+1),
        players: []        
      })
    }
  };
  return normalisedArr;
}


function collectWildCard ($) {
  var wildCardGameWeeks = [];
  if ($(mangerTransfersSelectors.wildcard.date).text()=="Date") {
    var wildCardHistoryLength = $(mangerTransfersSelectors.wildcard.table).length;
    for (i = 1; i <= wildCardHistoryLength; i++) {
      var wildcardRow = _.template(mangerTransfersSelectors.wildcard.row,{number:i});
      wildCardGameWeeks.push($(mangerTransfersSelectors.wildcard.table + wildcardRow + mangerTransfersSelectors.wildcard.status).text());
    }
    return wildCardGameWeeks;
  } else {
    return false;
  }

}


module.exports = {
    responseGeneration: responseGeneration
};

