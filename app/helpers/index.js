var config = require('../../config/config');
var _ = require('lodash');
var clubDetailsArr = require(config.ROOT +'/app/utilities/premier-league-globals').premierLeague.teams;

var helpers = (function() {

	function collectCodeFromUrl(url,splitBefore) {
		return url.split(splitBefore)[1].split('/')[0]
	}


	return {
		collectCodeFromUrl:collectCodeFromUrl
	};

})();

module.exports = helpers;
