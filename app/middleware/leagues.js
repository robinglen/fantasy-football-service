var config = require('../../config/config');

var leaguesMiddleware = {

    setDefaults: function(req, res, next) {
        var obj = {
            leagueId:  req.params.leagueId
        };
        res.locals = obj;
        next();
    }

};

module.exports = {
    setDefaults: leaguesMiddleware.setDefaults
};