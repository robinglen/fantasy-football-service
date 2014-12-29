var config = require('../../config/config'),
	managerOverviewService = require(config.ROOT +'/app/services/manager-overview'),
  managerTransferService = require(config.ROOT +'/app/services/manager-transfers'),
  managerGameweekService = require(config.ROOT +'/app/services/manager-gameweek'),
	collectHTML = require(config.ROOT +'/app/utilities/collect-html').collectHTML,
  urlGenerators = require(config.ROOT +'/app/utilities/url-generators'),
	responseBuilder = require(config.ROOT +'/app/utilities/response-builder'),
  cacheRequests = require(config.ROOT +'/app/utilities/cache-requests').cacheRequests;


// the caching on this with 4m usrers could use up all the memory on the machine... needs looking at in the future

var managerController = {
    // controller

    overview: function(req, res) {
       var managerOverviewURL = urlGenerators.generateManagerURLs(res.locals,'overview');
       var checkForCachedResult = cacheRequests.checkKeys(managerOverviewURL);
       if (checkForCachedResult) {
         responseBuilder.buildJSONPayload(res,200,checkForCachedResult); 
       } else {       
         collectHTML(managerOverviewURL,function(err, htmlResponse){
         		var managerOverviewResponse = managerOverviewService.responseGeneration.buildManagerOverviewResponse(htmlResponse.body,res.locals.managerId);
            cacheRequests.generate({
                response: managerOverviewResponse,
                url: managerOverviewURL,
                ttl: 3600000
              });         		
            responseBuilder.buildJSONPayload(res,200,managerOverviewResponse);
         })
      }
    },

    transfers: function(req, res) {
      var managerTransfersURL = urlGenerators.generateManagerURLs(res.locals,'transfers');
       var checkForCachedResult = cacheRequests.checkKeys(managerTransfersURL);
       if (checkForCachedResult) {
         responseBuilder.buildJSONPayload(res,200,checkForCachedResult); 
       } else {    
         collectHTML(managerTransfersURL,function(err, htmlResponse){
            var managerTransferResponse = managerTransferService.responseGeneration.buildManagerTransfersResponse(htmlResponse.body,res.locals.managerId);
            cacheRequests.generate({
                response: managerTransferResponse,
                url: managerTransfersURL,
                ttl: 3600000
              });   
            responseBuilder.buildJSONPayload(res,200,managerTransferResponse);
         })
      }      
    },    

    gameweek: function(req, res) {
      var managerGameweekURL = urlGenerators.generateManagerURLs(res.locals,'gameweek');
       var checkForCachedResult = cacheRequests.checkKeys(managerGameweekURL);
       if (checkForCachedResult) {
         responseBuilder.buildJSONPayload(res,200,checkForCachedResult); 
       } else {    
         collectHTML(managerGameweekURL,function(err, htmlResponse){
            var managerGameweekResponse = managerGameweekService.responseGeneration.buildManagerGameweekResponse(htmlResponse.body,res.locals.managerId,res.locals.gameweekNumber);
            cacheRequests.generate({
                response: managerGameweekResponse,
                url: managerGameweekURL,
                ttl: 3600000
              });  
            responseBuilder.buildJSONPayload(res,200,managerGameweekResponse);
         })
      }      
    }


};

module.exports = {
    overview: managerController.overview,
    transfers: managerController.transfers,
    gameweek: managerController.gameweek
};