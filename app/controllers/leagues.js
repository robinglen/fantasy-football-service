var config = require('../../config/config'),
	leagueOverviewService = require(config.ROOT +'/app/services/league-overview'),
	collectHTML = require(config.ROOT +'/app/utilities/collect-html').collectHTML,
  urlGenerators = require(config.ROOT +'/app/utilities/url-generators'),
	responseBuilder = require(config.ROOT +'/app/utilities/response-builder'),
  cacheRequests = require(config.ROOT +'/app/utilities/cache-requests').cacheRequests;

var leaguesController = {
    // controller

    overview: function(req, res) {
       var leagueOverviewURL = urlGenerators.generateLeagueURLs(res.locals);
       var checkForCachedResult = cacheRequests.checkKeys(leagueOverviewURL);
       if (checkForCachedResult) {
        responseBuilder.buildJSONPayload(res,200,checkForCachedResult);
       } else {
         collectHTML(leagueOverviewURL,function(err, htmlResponse){
         		var leagueOverviewResponse = leagueOverviewService.responseGeneration.buildleagueOverviewResponse(htmlResponse.body,res.locals.leagueId);
            cacheRequests.generate({
                response: leagueOverviewResponse,
                url: leagueOverviewURL,
                ttl: 3600000
              });         		
            responseBuilder.buildJSONPayload(res,200,leagueOverviewResponse);
         })
      }
    }


};

module.exports = {
    overview: leaguesController.overview
};