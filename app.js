'use strict';

// config
var config = require('./config/config');

// restify config
var server = require('./app/utilities/restify').appConfiguration.init();

// healthcheck route
require('./app/routes/healthcheck').routes.init(server);

// manager route
require('./app/routes/manager').routes.init(server);

// leagues route
require('./app/routes/leagues').routes.init(server);

// fixtures route
require('./app/routes/fixtures').routes.init(server);

server.listen(config.PORT, function() {
  console.log('%s listening at %s', server.name, server.url);
});	