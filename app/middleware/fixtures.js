var config = require('../../config/config');

var fixturesMiddleware = {

    setDefaults: function(req, res, next) {
        var obj = {
            gameweek:  req.params.gameweekNumber !== undefined ? req.params.gameweekNumber : null
        };
        res.locals = obj;
        next();
    }

};

module.exports = {
    setDefaults: fixturesMiddleware.setDefaults
};