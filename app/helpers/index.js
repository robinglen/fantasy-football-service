var _ = require('lodash');

var helpers = (function() {


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
		generateManagerURLs:generateManagerURLs
	};

})();

module.exports = helpers;
