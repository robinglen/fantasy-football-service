// config
var config = require('../../config/config');

var websiteSelectors = {

    managerOverview: {
            gameweekOverviewTable: '.ismPrimaryNarrow section:nth-of-type(1) table tr'
    }
};


module.exports = {
    managerOverview: websiteSelectors.managerOverview
};