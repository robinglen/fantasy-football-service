'use strict';
var winston = require('winston'),
  env = process.env.NODE_ENV;

var loggerConfig = {
  levels: {
    silly: 0,
    verbose: 1,
    info: 2,
    data: 3,
    warn: 4,
    comment: 5,
    error: 6
  },
  colors: {
    silly: 'magenta',
    verbose: 'cyan',
    info: 'green',
    data: 'grey',
    warn: 'yellow',
    comment: 'blue',
    error: 'red'
  }
};

var logger = {
  dev: new(winston.Logger)({
    transports: [
      new(winston.transports.Console)({
        colorize: true,
        timestamp:function() {return new Date(); }
      })
    ],
    levels: loggerConfig.levels,
    colors: loggerConfig.colors
  }),

  test: new(winston.Logger)({
    transports: [
      new(winston.transports.Console)({
        timestamp:function() {return new Date(); }
      })
    ],
  }),

  production: new(winston.Logger)({
    transports: [
      new(winston.transports.Console)({
        timestamp:function() {return new Date(); }
      })
    ],
  }),
};

module.exports = {
  logger:logger[env]
};