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
 if (locals.dataType==='league') {
  url = _.template('http://fantasy.premierleague.com/my-leagues/<%= code %>/standings/');
 } else {
  url = _.template('http://fantasy.premierleague.com/entry/<%= code %>/history/');
 }
 return  url({ 'code': locals.code });
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
      if (locals.dataType==='league') {
        cb(buildLeagueResponse(results,locals.requestType));
      } else {
        cb(buildManagerResponse(results,locals.requestType))
      }
  })
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


function buildManagerResponse (results,requestType) {
  return buildManagerObj(results.webpageBody);
}

/**
 * @param  {string} html
 */
function buildManagerObj (html) {
  $ = cheerio.load(html);
  var seasonHistoryLength = $('.ismPrimaryNarrow section:nth-of-type(1) table tr').length -1;
  var gameWeek = [];
  var weeklyPoints = [];
  var totalTransfers = [];
  var totalTransfersCosts = [];

  // map each team to an object
  for (i = 1; i <= seasonHistoryLength; i++) { 
    var element = '.ismPrimaryNarrow section:nth-of-type(1) table tr:nth-child(' + i +')';
    weeklyPoints.push(Number($(element + ' td.ismCol2').text()));
    totalTransfers.push(Number($(element + ' td.ismCol4').text()));
    totalTransfersCosts.push(Number($(element + ' td.ismCol5').text()));
    var obj = {
      gameWeek: $(element + ' td.ismCol1').text(),
      gameWeekPoints: Number($(element + ' td.ismCol2').text()),
      gameWeekRank: $(element + ' td.ismCol3').text(),
      transfersMade: Number($(element + ' td.ismCol4').text()),
      transfersCost: Number($(element + ' td.ismCol5').text()),
      teamValue: $(element + ' td.ismCol6').text(),
      overallPoints: Number($(element + ' td.ismCol7').text()),
      overallRank: $(element + ' td.ismCol8').text(),
      positionMovement: checkPositionMovement($(element + ' td.ismCol9 img').attr('src'))
    }
    gameWeek.push(obj)
  }
  return {
    manager: $('.ismSection2').text(),
    team: $('.ismSection3').text(),
    transfersMade: scoreArray(totalTransfers),
    transfersCost: scoreArray(totalTransfers),
    averagePoints: average(weeklyPoints),
    overallPoints: gameWeek[seasonHistoryLength-1].overallPoints,
    overallRank: gameWeek[seasonHistoryLength-1].overallRank,
    positionMovement: gameWeek[seasonHistoryLength-1].positionMovement,
    teamValue:gameWeek[seasonHistoryLength-1].teamValue,
    performance : {
      current: gameWeek
    }
  }
}


function scoreArray (arr) {
  var total = 0;
  arr.forEach(function(score) {
    total = total + score;
  });
  return total;
}


function average (arr) {
  var total = 0;
  arr.forEach(function(score) {
    total = total + score;
  });
  return Number((total/arr.length).toFixed(0));
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
        url: buildTeamHistoryURL($(element + ' td:nth-child(3) a').attr('href'))
      },
      gameWeek: $(element + ' td:nth-child(5)').text(),
      total: $(element + ' td:nth-child(6)').text(),
    }
    arr.push(obj)
	}
  return arr
}


/**
 * @param  {string} href
 */
function buildTeamHistoryURL(href) {
  var teamID = href.split('/entry/')[1].split('/')[0];
  return config.URL + '/fantasy/manager/' + teamID + '/overview';
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