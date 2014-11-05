'use strict';
var config  = require('../../config/config'),
	managerMiddleware = require(config.ROOT +'/app/middleware/manager'),
	managerController = require(config.ROOT +'/app/controllers/manager');



// route for survice
var routes = {
	init: function (server) {

		server.get('/fantasy/manager/:managerId/overview', 
			managerMiddleware.setDefaults,
			managerController.managerController.overview
			);

		server.get('/fantasy/manager/:managerId/transfers', 
			managerMiddleware.setDefaults,
			managerController.managerController.transfers
			);

	}
};

module.exports = {
	routes:routes
};