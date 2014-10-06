var config = require('../../config/config');
var request = require('request');
var async = require('async');
var cheerio = require('cheerio');
var _ = require('lodash');

/**
 * @param  {object}  locals
 * @return {string} 
 */
function buildLeagueURL (locals) {
  var url;
  if (locals.dataType==='manager') {
    switch(locals.requestType) {
      case 'transfers':
        url = _.template('http://fantasy.premierleague.com/entry/<%= code %>/transfers/history/');
        break;
      case  'overview':
        url = _.template('http://fantasy.premierleague.com/entry/<%= code %>/history/');
        break;
      case  'gameweek':
        url = _.template('http://fantasy.premierleague.com/entry/<%= code %>/event-history/<%= gameweek %>');
        break;   
      }   
    } else {
      url = _.template('http://fantasy.premierleague.com/my-leagues/<%= code %>/standings/');
    }
 return  url({ 'code': locals.code, 'gameweek':locals.gameweek });
}

/**
 * @param  {string} url
 * @param {string} requestType
 * @param {function} cb
 */
function init(url,locals,cb) {
  async.parallel({
      webpageBody : function (callback) {
        var websiteResponse = requestLeagueHTML(url, callback);
      }
  }, function (err,results) {
    if (locals.dataType==='manager') {
      cb(buildManagerResponse(results,locals.requestType,locals.code));
    } else {
      cb(buildLeagueResponse(results,locals.requestType));
    }
  })
}


function collectWildCard ($) {
  var wildCardGameWeeks = [];
  if ($('.ismPrimaryNarrow .ismTable:nth-of-type(2) tr th:nth-of-type(1)').text()=="Date") {
    var wildCardHistoryLength = $('.ismPrimaryNarrow .ismTable:nth-of-type(2) tbody tr').length;
    for (i = 1; i <= wildCardHistoryLength; i++) { 
      var element = '.ismPrimaryNarrow .ismTable:nth-of-type(2) tbody tr:nth-child(' + i +')';
      wildCardGameWeeks.push($(element+ ' td:nth-child(2)').text());
    }
    return wildCardGameWeeks;
  } else {
    return false;
  }

}


function buildTransferResponse (html,managerID) {
  $ = cheerio.load(html);
  var wildCardObj = collectWildCard($)
  var transferHistoryLength = $('.ismPrimaryNarrow .ismTable:nth-of-type(1) tr').length -1;
  var transfers = [];
  var collectOverview = collectManagerOverview($);
  for (i = 1; i <= transferHistoryLength; i++) { 
    var element = '.ismPrimaryNarrow .ismTable:nth-of-type(1) tr:nth-child(' + i +')';
    var obj = {
      date: $(element + ' td:nth-child(1)').text(),
      playerOut: $(element + ' td:nth-child(2)').text(),
      playerIn: $(element + ' td:nth-child(3)').text(),
      gameWeek: $(element + ' td:nth-child(4)').text(),
    }
    transfers.push(obj);
  }
  var groupedTransfers = groupTransfers(transfers);
  var playedWildCard;
  if (wildCardObj) {
    playedWildCard = true;
    wildCardObj.forEach(function(wildcard){
      groupedTransfers[wildcard-1].willdcard = true;
    })
  } else {
    playedWildCard= false;
  }
  return {
    manager: collectOverview.manager,
    playedWildCard:playedWildCard,
    team: collectOverview.team,
    url:buildManagerHistoryURL(managerID),
    transfers: groupedTransfers    
  }
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
      gameWeek:transfer.gameWeek,
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
        players: []        
      })
    }
  };
  return normalisedArr;
}



function buildLeagueResponse (results,requestType) {
  switch(requestType) {
    case "api":
      return buildLeagueObj(results.webpageBody);
    case "gecko":
      return buildGeckoResponse(results.webpageBody);   
    default:
      return buildHTML(results.webpageBody);   
  }  
}


function buildManagerResponse (results,dataType,managerID) {
  switch(dataType) {
    case "overview":
      return buildManagerOverviewResponse(results.webpageBody,managerID);
    case "transfers":
      return buildTransferResponse(results.webpageBody,managerID); 
    case "gameweek":
     return buildManagerGameweekResponse(results.webpageBody,managerID); 
  } 

}

function buildManagerGameweekResponse (html,managerID) {
  $ = cheerio.load(html);
  var collectOverview = collectManagerOverview($);
  var gameweekPoints = Number($('.ismSBPrimary div').text().split('pts')[0]);
  var gameweekAveragePoints = Number($('.ismSBSecondaryVal').text().split('pts')[0]);
  var gameweekHighestPoints = Number($('.ismStatLink').text().split('pts')[0]);
  var teamSheet = buildTeamLineUp($('.ismPitchContainer').html());
  return {
    manager: collectOverview.manager,
    team: collectOverview.team,
    gameweekPoints: gameweekPoints,
    gameweekAveragePoints:gameweekAveragePoints,
    gameweekHighestPoints:gameweekHighestPoints,
    teamSheet: teamSheet   
  }
}

function buildTeamLineUp (pitchHTML) {
  var $ = cheerio.load(pitchHTML);
  var goalkeeper = buildPlayerObject($('.ismPitchRow1 .ismPitchCell:nth-of-type(3)').html());
  return {
    goalkeeper: goalkeeper
  }
}

function buildPlayerObject (positionHTML) {
  var $ = cheerio.load(positionHTML);
  var player = {
    name: $('.ismElementDetail .ismPitchWebName').text(),
    points: Number($('.ismElementDetail .ismPitchStat').text()),
    club: $('.ismShirtContainer img').attr('title'),
    captain: $('.JS_ISM_CAPTAIN .ismCaptain').hasClass('ismCaptainOn'),
    viceCaptain: $('.JS_ISM_CAPTAIN .ismViceCaptain').hasClass('ismViceCaptainOn'),
    dreamteam: $('.JS_ISM_DREAMTEAM a').hasClass('ismDreamTeam')   
  }
  return player
}



function buildManagerOverviewResponse (html,managerID) {
  $ = cheerio.load(html);
  var seasonHistoryLength = $('.ismPrimaryNarrow section:nth-of-type(1) table tr').length -1;
  var gameWeek = [];
  var weeklyPoints = [];
  var totalTransfers = [];
  var totalTransfersCosts = [];
  var collectOverview = collectManagerOverview($);
  var collectGameWeekData = collectGameWeekRelated($,managerID);
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
}

function collectGameWeekRelated ($,managerID) {
 var seasonHistoryLength = $('.ismPrimaryNarrow section:nth-of-type(1) table tr').length -1;
  var gameWeek = [];
  var weeklyPoints = 0;
  var totalTransfers = 0;
  var totalTransfersCosts = 0;
  var collectOverview = collectManagerOverview($);
  // map each team to an object
  for (i = 1; i <= seasonHistoryLength; i++) { 
    var element = '.ismPrimaryNarrow section:nth-of-type(1) table tr:nth-child(' + i +')';
    weeklyPoints = weeklyPoints + Number($(element + ' td.ismCol2').text());
    totalTransfers= totalTransfers + Number($(element + ' td.ismCol4').text());
    totalTransfersCosts= totalTransfersCosts +Number($(element + ' td.ismCol5').text());
    var obj = {
      title: $(element + ' td.ismCol1').text(),
      gameWeekPoints: Number($(element + ' td.ismCol2').text()),
      gameWeekRank: $(element + ' td.ismCol3').text(),
      transfersMade: Number($(element + ' td.ismCol4').text()),
      transfersCost: Number($(element + ' td.ismCol5').text()),
      teamValue: $(element + ' td.ismCol6').text(),
      overallPoints: Number($(element + ' td.ismCol7').text()),
      overallRank: $(element + ' td.ismCol8').text(),
      positionMovement: checkPositionMovement($(element + ' td.ismCol9 img').attr('src')),
      url: buildGameweekOverviewURL(managerID,i)
    }
    gameWeek.push(obj)
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



function collectManagerOverview ($) {
  return {
    manager: $('.ismSection2').text(),
    team: $('.ismSection3').text(),  
    overallPoints: $('.ismDefList.ismRHSDefList dd:nth-of-type(1)').text(), 
    overallRank: $('.ismDefList.ismRHSDefList dd:nth-of-type(2)').text() 
  }
}


function collectCareerHistory ($) {
  var careerHistory =[];
  var careerHistoryLength = $('.ismPrimaryNarrow section:nth-of-type(2) table tr').length -1;
  for (i = 1; i <= careerHistoryLength; i++) {
    var element = '.ismPrimaryNarrow section:nth-of-type(2) table tr:nth-child(' + i +')';
    var obj = {
        season: $(element + ' td.ismCol1').text(),
        points: $(element + ' td.ismCol2').text(),
        rank: $(element + ' td.ismCol3').text()
    }
    careerHistory.push(obj); 
  }
  return careerHistory;
}







/**
 * @param  {string} url
 * @param {function} callback
 */
function requestLeagueHTML (url,callback) {
	request(url, function (error, response, body) {
	  	if (!error && response.statusCode == 200) {
	    	callback(null,body) ;
	  	}
	})
}

/**
 * @param  {string} html
 */
function buildGeckoResponse (html) {
  $ = cheerio.load(html);
  // build object required for custom html widget
  var response = {item: [
    {text: '<style>.fantasy-league td {padding:5px}</style><table class="fantasy-league" style="font-size: 15px; width: 100%;">' + $('table.ismStandingsTable').html() + '</table>'}
    ]
  };
  return response;
}

/**
 * @param  {string} html
 */
function buildHTML (html) {
  $ = cheerio.load(html);
  // just mark up from league page
  var response = {body: '<table>' + $('table.ismStandingsTable').html() + '</table>'};
  return response;
}

/**
 * @param  {string} html
 */
function buildLeagueObj (html) {
	$ = cheerio.load(html);
	var tableRows = $('.ismStandingsTable tr').length + 1;
  var arr = [];
	// map each team to an object
  for (i = 3; i <= tableRows; i++) { 
		var element = '.ismStandingsTable tr:nth-child(' + i +')'
    var obj = {
      positionMovement: checkPositionMovement($(element + ' td:nth-child(1) img').attr('src')),
      position: $(element + ' td:nth-child(2)').text(),
      team: $(element + ' td:nth-child(3)').text(), 
      manager: {
        name: $(element + ' td:nth-child(4)').text(),
        url: buildManagerHistoryURL(getCodeFromURL($(element + ' td:nth-child(3) a').attr('href')))
      },
      gameWeek: $(element + ' td:nth-child(5)').text(),
      total: $(element + ' td:nth-child(6)').text(),
    }
    arr.push(obj)
	}
  return arr
}


/**
 * @param  {string} managerID
 */
function buildManagerHistoryURL(managerID) {
  return config.URL + '/fantasy/manager/' + managerID + '/overview';
}

function getCodeFromURL(href) {
  return href.split('/entry/')[1].split('/')[0];
}


/**
 * @param  {string} managerID
 */
function buildTransferHistoryURL(managerID) {
  return config.URL + '/fantasy/manager/' + managerID + '/transfers';
}



/**
 * @param  {string} href
 */
function buildGameweekOverviewURL(managerID,gameweek) {
  return config.URL + '/fantasy/manager/' + managerID + '/gameweek/' + gameweek;
}

/**
 * @param  {string} imageURL
 */
function checkPositionMovement (imageURL) {

	switch (imageURL) {
    case "http://cdn.ismfg.net/static/img/new.png":
    	return "-"
    case "http://cdn.ismfg.net/static/img/up.png":
    	return "up"
    case "http://cdn.ismfg.net/static/img/down.png":
    	return "down"
    default:
    	return "-"
	}
}



module.exports = {
  init:init,
  buildLeagueURL:buildLeagueURL
};