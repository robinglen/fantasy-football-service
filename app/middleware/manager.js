var config = require('../../config/config');

var managerMiddleware = {

    setDefaults: function(req, res, next) {
        var obj = {
            managerId:  req.params.managerId,
            gameweek:  req.params.gameweekNumber !== undefined ? req.params.gameweekNumber : 1
        };
        res.locals = obj;
        next();
    }

};

module.exports = {
    setDefaults: managerMiddleware.setDefaults
};