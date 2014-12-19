var config  = require('../../config/config'),
	responseBuilder = require(config.ROOT +'/app/utilities/response-builder');
// route for survice
var routes = {
	init: function (server) {
		server.get('/', function(req, res) {
			helpers.buildJSONPayload(res,200,{
				name:'fantasy-league-service',
				uptimeSecs: parseInt(process.uptime(), 10)
			});
		});
	}
};

module.exports = {
	routes:routes
};