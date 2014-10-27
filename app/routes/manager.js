'use strict';
var config  = require('../../config/config'),
	managerMiddleware = require(config.ROOT +'/app/middleware/manager'),
	managerController = require(config.ROOT +'/app/controllers/manager');


// route for survice
var routes = {
	init: function (server) {
		// need start doing these routes proper
		server.get('/fantasy/manager/:managerId/:request', managerMiddleware.setDefaults, managerController.managerController.init);
	}
};

module.exports = {
	routes:routes
};