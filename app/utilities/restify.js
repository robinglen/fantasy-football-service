// config
var config = require('../../config/config');
var restify = require('restify');

var appConfiguration = {

    init: function() {
        var server = restify.createServer();

        server.use(restify.queryParser());

        server.use(restify.CORS(){
        	origins: ['https://www.finaleleven.com', 'http://finaleleven.com', 'http://127.0.0.1']
        });

        return server;
    }
};


module.exports = {
    appConfiguration: appConfiguration
};