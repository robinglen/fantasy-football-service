'use strict';
var config  = require('../../config/config'),
	fantasyController = require(config.ROOT +'/app/controllers/fantasy-controller.js'),
	helpers = require(config.ROOT +'/app/helpers/index.js');


var middleware = {
	// middleware to pick up request criteria
	fantasyRequest: function (req, res, next) {
		var obj = {
			dataType:  req.params.dataType == 'manager' ? 'manager' : 'league',
			code:  req.params.code !== undefined ? req.params.code : '4526',
			requestType:  req.params.request !== undefined ? req.params.request : 'api'
		};
		res.locals = obj;
		next();	
	},
};

// route for survice
var routes = {
	init: function (server) {
		server.get('/fantasy/:dataType/:code/:request', middleware.fantasyRequest, fantasyController.init);
	}
};

module.exports = {
	middleware:middleware,
	routes:routes
};