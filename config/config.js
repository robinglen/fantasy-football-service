'use strict';

var _ = require('lodash');

module.exports = _.extend(
    require(__dirname + '/../config/env.js'),
    require(__dirname + '/../config/logger')
);

