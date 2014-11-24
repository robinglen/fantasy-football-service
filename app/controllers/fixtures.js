var config = require('../../config/config'),
	fixturesGameweekService = require(config.ROOT +'/app/services/fixtures-gameweek'),
	collectHTML = require(config.ROOT +'/app/utilities/collect-html').collectHTML,
  urlGenerators = require(config.ROOT +'/app/utilities/url-generators'),
  responseBuilder = require(config.ROOT +'/app/utilities/response-builder');


var fixturesController = {
    // controller

    gameweek: function(req, res) {
       var gameweekFixturesURL = urlGenerators.generateGameweekFixturesURLs(res.locals);
       collectHTML(gameweekFixturesURL,function(err, htmlResponse){
       		var gameweekFixturesResponse = fixturesGameweekService.responseGeneration.buildgameweekFixturesResponse(htmlResponse.body,res.locals.gameweekNumber);
       		responseBuilder.buildJSONPayload(res,200,gameweekFixturesResponse);
       })
    }


};

module.exports = {
    gameweek: fixturesController.gameweek
};