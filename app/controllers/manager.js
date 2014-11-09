var config = require('../../config/config'),
	managerOverviewService = require(config.ROOT +'/app/services/manager-overview'),
  managerTransferService = require(config.ROOT +'/app/services/manager-transfers'),
  managerGameweekService = require(config.ROOT +'/app/services/manager-gameweek'),
	collectHTML = require(config.ROOT +'/app/utilities/collect-html').collectHTML,
	helpers = require(config.ROOT +'/app/helpers/index');


var managerController = {
    // controller

    overview: function(req, res) {
       var managerOverviewURL = helpers.generateManagerURLs(res.locals,'overview');
       collectHTML(managerOverviewURL,function(err, htmlResponse){
       		var managerOverviewResponse = managerOverviewService.responseGeneration.buildManagerOverviewResponse(htmlResponse.body,res.locals.managerId);
       		helpers.buildJSONPayload(res,200,managerOverviewResponse);
       })
    },

    transfers: function(req, res) {
      var managerTransfersURL = helpers.generateManagerURLs(res.locals,'transfers');
       collectHTML(managerTransfersURL,function(err, htmlResponse){
          var managerTransferResponse = managerTransferService.responseGeneration.buildManagerTransfersResponse(htmlResponse.body,res.locals.managerId);
          helpers.buildJSONPayload(res,200,managerTransferResponse);
       })      
    },    

    gameweek: function(req, res) {
      var managerGameweekURL = helpers.generateManagerURLs(res.locals,'gameweek');
       collectHTML(managerGameweekURL,function(err, htmlResponse){
          var managerGameweekResponse = managerGameweekService.responseGeneration.buildManagerGameweekResponse(htmlResponse.body,res.locals.managerId,res.locals.gameweekNumber);
          helpers.buildJSONPayload(res,200,managerGameweekResponse);
       })      
    }


};

module.exports = {
    managerController: managerController
};