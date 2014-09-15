var request = require('request');
var async = require('async');
var cheerio = require('cheerio');
var _ = require('lodash');

/**
 * @param  {string}  leagueCode
 * @return {string} 
 */
function buildLeagueURL (leagueCode) {
 var leagueURL = _.template('http://fantasy.premierleague.com/my-leagues/<%= code %>/standings/');
 return  leagueURL({ 'code': leagueCode });
}

/**
 * @param  {string} leagueURL
 * @param {string} requestType
 * @param {function} cb
 */
function init(leagueURL,requestType,cb) {
	async.parallel({
    	webpageBody : function (callback) {
    		var websiteResponse = requestLeagueHTML(leagueURL, callback);
    	}
	}, function (err,results) {
  switch(requestType) {
    case "api":
      cb(buildLeagueObj(results.webpageBody));
    case "gecko":
      cb(buildGeckoResponse(results.webpageBody));   
    default:
      cb(buildHTML(results.webpageBody));
    }    
	});
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
      manager: $(element + ' td:nth-child(4)').text(),
      gameWeek: $(element + ' td:nth-child(5)').text(),
      total: $(element + ' td:nth-child(6)').text(),
    }
    arr.push(obj)
	}
  return arr
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