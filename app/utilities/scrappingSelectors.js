// config
var config = require('../../config/config');

var websiteSelectors = {

    managerOverview: function() {
        var app = express();

        appConfiguration.templateConfig(app);
        //appConfiguration.commonURLParams(app);

        app.enable('view cache');
        app.disable('etag');
        app.disable('x-powered-by');

        app.use(bodyParser.urlencoded({ extended: false }))
        app.use(bodyParser.json())



        //use the express-validator plugin for sanitization,filtering and validation
        //app.use(expressValidator);

        //use cookie parse for extracting cookies
        //app.use(express.cookieParser());

        //app.use(md.middleware.sanitizeParam);
        //app.use(app.router);

        return app;
    }
};


module.exports = {
    appConfiguration: appConfiguration
};