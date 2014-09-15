var config  = require('../../config/config'),
	fanstasyService = require(config.ROOT +'/app/services/fantasy-service.js'),
	helpers = require(config.ROOT +'/app/helpers/index.js');

exports.init = function(req, res) {
	var leagueURL = fanstasyService.buildLeagueURL(res.locals.code);
	fanstasyService.init(leagueURL,res.locals.requestType, function (result) {
	  helpers.buildJSONPayload(res,200,result);
	});
};	