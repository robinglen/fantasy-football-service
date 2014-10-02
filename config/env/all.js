'use strict';

var path = require('path');
var rootPath = path.normalize(__dirname + '/../..');

module.exports = {
	ROOT: rootPath,
	port: process.env.PORT || 8080,
	NODE_ENV:process.env.NODE_ENV,
	URL:process.env.URL
};