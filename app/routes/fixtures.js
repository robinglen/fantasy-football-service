'use strict';
var config  = require('../../config/config'),
	fixturesMiddleware = require(config.ROOT +'/app/middleware/fixtures'),
	fixturesController = require(config.ROOT +'/app/controllers/fixtures');



// route for survice
var routes = {
	init: function (server) {

		server.get('/fantasy/fixtures', 
			fixturesMiddleware.setDefaults,
			fixturesController.fixturesController.gameweek
			);

		server.get('/fantasy/fixtures/:gameweekNumber', 
			fixturesMiddleware.setDefaults,
			fixturesController.fixturesController.gameweek
			);

	}
};

module.exports = {
	routes:routes
};