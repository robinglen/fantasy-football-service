'use strict';
var config  = require('../../config/config'),
	fixturesMiddleware = require(config.ROOT +'/app/middleware/fixtures'),
	fixturesController = require(config.ROOT +'/app/controllers/fixtures');


// route for fixtures
var routes = {
	init: function (server) {

		server.get('/fixtures/gameweek', 
			fixturesMiddleware.setDefaults,
			fixturesController.gameweek
			);

		server.get('/fixtures/gameweek/:gameweekNumber', 
			fixturesMiddleware.setDefaults,
			fixturesController.gameweek
			);

	}
};

module.exports = {
	routes:routes
};