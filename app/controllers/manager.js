var config = require('../../config/config'),
	managerService = require(config.ROOT +'/app/services/manager'),
	collectHTML = require(config.ROOT +'/app/utilities/collect-html').collectHTML,
	helpers = require(config.ROOT +'/app/helpers/index.js');


var managerController = {
    // controller

    init: function(req, res) {
       var managerOverviewURL = managerService.utilities.generateURL(res.locals);
       collectHTML(managerOverviewURL,function(err, htmlResponse){
       		var managerOverviewResponse = managerService.responseGeneration.buildManagerOverviewResponse(htmlResponse.body,res.locals.managerId);
       		helpers.buildJSONPayload(res,200,managerOverviewResponse);
       })
    }


};

module.exports = {
    managerController: managerController
};