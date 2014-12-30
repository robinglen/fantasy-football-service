var config = require('../../config/config');

var premierLeagueFormMiddleware = {

    setDefaults: function(req, res, next) {
        var obj = {
            type:  req.params.type !== undefined ? req.params.type : null
        };
        res.locals = obj;
        next();
    }

};

module.exports = {
    setDefaults: premierLeagueFormMiddleware.setDefaults
};