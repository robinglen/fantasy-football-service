var config = require('../../config/config');
var _ = require('lodash');
var clubDetailsArr = require(config.ROOT +'/app/utilities/premier-league-globals').premierLeague.teams;

var helpers = (function() {


	function generateGameweekFixturesURLs(opts) {
	  if (opts.gameweek) {
	      var url = _.template('http://fantasy.premierleague.com/fixtures/<%= gameweek %>/');
	      return  url({ 'gameweek': opts.gameweek});
	  } else {
	  	return 'http://fantasy.premierleague.com/fixtures';
	  }
    }


	function generateLeagueURLs(opts) {
      var url = _.template('http://fantasy.premierleague.com/my-leagues/<%= leagueId %>/standings/');

      return  url({ 'leagueId': opts.leagueId});
    }


	function generateManagerURLs(opts, page) {
      switch(page) {
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
      return  url({ 'managerId': opts.managerId, 'gameweek':opts.gameweek });
    }

    function searchForClubDetails(value, searchTerm) {
    	var clubDetailsObj = {
    		error: value + ' could not be found'
    	};
        clubDetailsArr.forEach(function(club,i){
    		if (club[searchTerm]===value) {
    			club.code = i+1;
    			clubDetailsObj = club;
    		}          
        })
    	return clubDetailsObj;
    }


	function collectCodeFromUrl(url,splitBefore) {
		return url.split(splitBefore)[1].split('/')[0]
	}

	/**
	 * @class setCacheHeader 
	 * @param {object}	data
	 *					cache response
	 */
	function setCacheHeader (data) {
		var cacheHeader = {
				'Content-Length': Buffer.byteLength(JSON.stringify(data)),
				'content-type': 'application/json; charset=utf-8',
				// just some bog standard caching
				'Cache-Control': ['max-age=600','stale-if-error=120', 'stale-while-revalidate=120'],
				'Last-Modified':  new Date()
			};
		return cacheHeader;
	}

	/**
	 * @param {object}	res
	 * @param {int}		statusCode
	 * @param {string}	body
	 * @return {object}	 
	 */
	function buildJSONPayload (res,statusCode,body) {
		var responseHeaders;
		if (statusCode===200) {
			res.set(setCacheHeader(body));
		}
		res.charSet('utf-8');	
		res.send(statusCode,body);
		res.end();
	}

	return {
		collectCodeFromUrl:collectCodeFromUrl,
		setCacheHeader:setCacheHeader,
		buildJSONPayload:buildJSONPayload,
		generateManagerURLs:generateManagerURLs,
		generateLeagueURLs:generateLeagueURLs,
		generateGameweekFixturesURLs:generateGameweekFixturesURLs,
		searchForClubDetails:searchForClubDetails
	};

})();

module.exports = helpers;
