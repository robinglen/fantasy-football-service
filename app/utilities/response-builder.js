var config = require('../../config/config'),
	_ = require('lodash');

var response = (function() {

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
		setCacheHeader:setCacheHeader,
		buildJSONPayload:buildJSONPayload
	};

})();

module.exports = response;
