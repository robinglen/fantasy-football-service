// config
var config = require('../../config/config');
var restify = require('restify');

var appConfiguration = {

    init: function() {
        var server = restify.createServer();

        server.use(restify.queryParser());

        server.use(restify.CORS());

        return server;
    }
};


module.exports = {
    appConfiguration: appConfiguration
};