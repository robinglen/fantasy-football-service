'use strict';
var config  = require('../../config/config'),
	premierLeagueFormController = require(config.ROOT +'/app/controllers/premier-league-form');

var leaguesMiddleware = require(config.ROOT +'/app/middleware/leagues'),
	leaguesController = require(config.ROOT +'/app/controllers/leagues');

// route for fixtures
var routes = {
	init: function (server) {

		server.get('/premier-league/form',
			premierLeagueFormController.overall
			)
	}
};
	
module.exports = {
	routes:routes
};