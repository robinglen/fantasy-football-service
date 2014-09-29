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
  var arr = [];
  var seasonHistoryLength = $('.ismPrimaryNarrow section:nth-of-type(1) table tr').length -1;
  var arr = [];
  // map each team to an object
  for (i = 1; i <= seasonHistoryLength; i++) { 
    var element = '.ismPrimaryNarrow section:nth-of-type(1) table tr:nth-child(' + i +')';
    var obj = {
      gameWeek: $(element + ' td.ismCol1').text(),
      gameWeekPoints: $(element + ' td.ismCol2').text(),
      gameWeekRank: $(element + ' td.ismCol3').text(),
      transfersMade: $(element + ' td.ismCol4').text(),
      transfersCost: $(element + ' td.ismCol5').text(),
      teamValue: $(element + ' td.ismCol6').text(),
      overallPoints: $(element + ' td.ismCol7').text(),
      overallRank: $(element + ' td.ismCol7').text(),
      positionMovement: checkPositionMovement($(element + ' td.ismCol8 img').attr('src')),
    }
    arr.push(obj)
  }
  return {
    manager: $('.ismSection2').text(),
    team: $('.ismSection3').text(),
    performance : {
      current: arr
    }
  }
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
      team: {
        name: $(element + ' td:nth-child(3)').text(),
        url: buildTeamHistoryURL($(element + ' td:nth-child(3) a').attr('href'))
      },
      manager: $(element + ' td:nth-child(4)').text(),
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
  return config.URL + '/fantasy/team/' + teamID + '/overview';
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