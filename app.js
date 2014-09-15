'use strict';

/**
 * Module dependencies.
 */
var restify = require('restify');

/**
 * Setup server
 */
var server = restify.createServer();

server.use(restify.queryParser());

// fantasy service route
require('./app/routes/fantasy-route.js').routes.init(server);

// Start the app by listening on <port>
var port = process.env.PORT || 8080;

server.listen(port, function() {
  console.log('%s listening at %s', server.name, server.url);
});	