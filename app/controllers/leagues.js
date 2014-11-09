var config = require('../../config/config'),
	leagueOverviewService = require(config.ROOT +'/app/services/league-overview'),
	collectHTML = require(config.ROOT +'/app/utilities/collect-html').collectHTML,
	helpers = require(config.ROOT +'/app/helpers/index');


var leaguesController = {
    // controller

    overview: function(req, res) {
       var leagueOverviewURL = helpers.generateLeagueURLs(res.locals);
       collectHTML(leagueOverviewURL,function(err, htmlResponse){
       		var leagueOverviewResponse = leagueOverviewService.responseGeneration.buildleagueOverviewResponse(htmlResponse.body,res.locals.leagueId);
       		helpers.buildJSONPayload(res,200,leagueOverviewResponse);
       })
    }


};

module.exports = {
    leaguesController: leaguesController
};