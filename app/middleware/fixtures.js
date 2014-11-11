var config = require('../../config/config');

var fixturesMiddleware = {

    setDefaults: function(req, res, next) {
        var obj = {
            gameweek:  req.params.gameweekNumber !== undefined ? req.params.gameweekNumber : 1
        };
        res.locals = obj;
        next();
    }

};

module.exports = {
    setDefaults: fixturesMiddleware.setDefaults
};