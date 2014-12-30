'use strict';
var config  = require('../../config/config'),
	premierLeagueFormMiddleware = require(config.ROOT +'/app/middleware/premier-league-form'),
	premierLeagueFormController = require(config.ROOT +'/app/controllers/premier-league-form');

var leaguesMiddleware = require(config.ROOT +'/app/middleware/leagues'),
	leaguesController = require(config.ROOT +'/app/controllers/leagues');

// route for fixtures
var routes = {
	init: function (server) {

		server.get('/fantasy/premier-league/form/:type',
			premierLeagueFormMiddleware.setDefaults,
			premierLeagueFormController.overall
			)
	}
};
	
module.exports = {
	routes:routes
};