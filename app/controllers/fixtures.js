var config = require('../../config/config'),
	fixturesService = require(config.ROOT +'/app/services/fixtures'),
	collectHTML = require(config.ROOT +'/app/utilities/collect-html').collectHTML,
	helpers = require(config.ROOT +'/app/helpers/index');


var fixturesController = {
    // controller

    gameweek: function(req, res) {
       var gameweekFixturesURL = helpers.generateGameweekFixturesURLs(res.locals);
       collectHTML(gameweekFixturesURL,function(err, htmlResponse){
       		var gameweekFixturesResponse = fixturesService.responseGeneration.buildgameweekFixturesResponse(htmlResponse.body,res.locals.gameweekNumber);
       		helpers.buildJSONPayload(res,200,gameweekFixturesResponse);
       })
    }


};

module.exports = {
    fixturesController: fixturesController
};