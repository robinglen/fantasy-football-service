var config = require('../../config/config'),
	premierLeagueFormService = require(config.ROOT +'/app/services/premier-league-form'),
	collectHTML = require(config.ROOT +'/app/utilities/collect-html').collectHTML,
  urlGenerators = require(config.ROOT +'/app/utilities/url-generators'),
  responseBuilder = require(config.ROOT +'/app/utilities/response-builder'),
  cacheRequests = require(config.ROOT +'/app/utilities/cache-requests').cacheRequests;


var premierLeagueController = {
    // controller

    overall: function(req, res) {
      var overallFormURL = urlGenerators.generatePremierLeagueFormURLs();
      var checkForCachedResult = cacheRequests.checkKeys(overallFormURL);
      if (checkForCachedResult) {
         responseBuilder.buildJSONPayload(res,200,checkForCachedResult); 
      } else {
         collectHTML(overallFormURL,function(err, htmlResponse){
            var overallFormResponse = premierLeagueFormService.responseGeneration.buildOverallFormResponse(htmlResponse.body);
         		cacheRequests.generate({
                response: overallFormResponse,
                url: overallFormURL,
                ttl: 3600000
              });
            responseBuilder.buildJSONPayload(res,200,overallFormResponse);
         })
      }
    }
};


module.exports = {
    overall: premierLeagueController.overall
};