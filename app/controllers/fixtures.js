var config = require('../../config/config'),
	fixturesGameweekService = require(config.ROOT +'/app/services/fixtures-gameweek'),
	collectHTML = require(config.ROOT +'/app/utilities/collect-html').collectHTML,
  urlGenerators = require(config.ROOT +'/app/utilities/url-generators'),
  responseBuilder = require(config.ROOT +'/app/utilities/response-builder'),
  cacheRequests = require(config.ROOT +'/app/utilities/cache-requests').cacheRequests;


var fixturesController = {
    // controller

    gameweek: function(req, res) {
      var gameweekFixturesURL = urlGenerators.generateGameweekFixturesURLs(res.locals);
      var checkForCachedResult = cacheRequests.checkKeys(gameweekFixturesURL);
      if (checkForCachedResult) {
         responseBuilder.buildJSONPayload(res,200,checkForCachedResult); 
      } else {
         collectHTML(gameweekFixturesURL,function(err, htmlResponse){
            var gameweekFixturesResponse = fixturesGameweekService.responseGeneration.buildgameweekFixturesResponse(htmlResponse.body,res.locals.gameweekNumber);
         		cacheRequests.generate({
                response: gameweekFixturesResponse,
                url: gameweekFixturesURL,
                ttl: 3600000
              });
            responseBuilder.buildJSONPayload(res,200,gameweekFixturesResponse);
         })
      }
    }
};


module.exports = {
    gameweek: fixturesController.gameweek
};