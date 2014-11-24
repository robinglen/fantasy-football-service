'use strict';

var path = require('path');
var rootPath = path.normalize(__dirname + '/../');
module.exports = {
	ROOT: rootPath,
	NODE_ENV:process.env.NODE_ENV || 'DEV',
	PORT: process.env.PORT || 8080
};