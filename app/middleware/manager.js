var config = require('../../config/config');

var managerMiddleware = {

    setDefaults: function(req, res, next) {
        var obj = {
            managerId:  req.params.managerId
        };
        res.locals = obj;
        next();
    }

};

module.exports = {
    setDefaults: managerMiddleware.setDefaults
};