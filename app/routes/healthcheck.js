var config  = require('../../config/config'),
	helpers = require(config.ROOT +'/app/helpers/index.js');
// route for survice
var routes = {
	init: function (server) {
		server.get('/', function(req, res) {
			helpers.buildJSONPayload(res,200,{
				message:'fantasy-league-service'
			});
		});
	}
};

module.exports = {
	routes:routes
};