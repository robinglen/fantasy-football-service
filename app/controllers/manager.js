var config = require('../../config/config'),
	managerService = require(config.ROOT +'/app/services/manager'),
	collectHTML = require(config.ROOT +'/app/utilities/collect-html').collectHTML;


var managerController = {
    // controller

    init: function(req, res) {
       var managerOverviewURL = managerService.service.generateURL(res.locals);
       collectHTML(managerOverviewURL,function(err, body){
       		console.log(body);
       })
    }


};

module.exports = {
    managerController: managerController
};