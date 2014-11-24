var config = require('../../config/config'),
	leagueOverviewService = require(config.ROOT +'/app/services/league-overview'),
	collectHTML = require(config.ROOT +'/app/utilities/collect-html').collectHTML,
  urlGenerators = require(config.ROOT +'/app/utilities/url-generators'),
	responseBuilder = require(config.ROOT +'/app/utilities/response-builder');


var leaguesController = {
    // controller

    overview: function(req, res) {
       var leagueOverviewURL = urlGenerators.generateLeagueURLs(res.locals);
       collectHTML(leagueOverviewURL,function(err, htmlResponse){
       		var leagueOverviewResponse = leagueOverviewService.responseGeneration.buildleagueOverviewResponse(htmlResponse.body,res.locals.leagueId);
       		responseBuilder.buildJSONPayload(res,200,leagueOverviewResponse);
       })
    }


};

module.exports = {
    overview: leaguesController.overview
};