var config = require('../../config/config'),
	managerService = require(config.ROOT +'/app/services/manager'),
	collectHTML = require(config.ROOT +'/app/utilities/collect-html').collectHTML;


var managerController = {
    // controller

    init: function(req, res) {
       var managerOverviewURL = managerService.utilities.generateURL(res.locals);
       collectHTML(managerOverviewURL,function(err, res){
       		managerService.responseGeneration.buildManagerOverviewResponse(res.body)
       })
    }


};

module.exports = {
    managerController: managerController
};