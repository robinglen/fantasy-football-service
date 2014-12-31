'use strict';
var config  = require('../../config/config'),
	managerMiddleware = require(config.ROOT +'/app/middleware/manager'),
	managerController = require(config.ROOT +'/app/controllers/manager');



// route for managers
var routes = {
	init: function (server) {

		server.get('/manager/:managerId/overview', 
			managerMiddleware.setDefaults,
			managerController.overview
			);

		server.get('/manager/:managerId/transfers', 
			managerMiddleware.setDefaults,
			managerController.transfers
			);

		server.get('/manager/:managerId/gameweek/:gameweekNumber', 
			managerMiddleware.setDefaults,
			managerController.gameweek
			);

	}
};

module.exports = {
	routes:routes
};