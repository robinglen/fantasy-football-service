// config
var config = require('../../config/config');

var websiteSelectors = {

    managerOverview: {
            gameweekOverviewTable: '.ismPrimaryNarrow section:nth-of-type(1) table tr',
            gameweekOverviewTableRow: ':nth-child(<%= number %>)',
            managerName: '.ismSection2',
            teamName: '.ismSection3',
            overallPoints: '.ismDefList.ismRHSDefList dd:nth-of-type(1)',
            overallRank: '.ismDefList.ismRHSDefList dd:nth-of-type(2)'

    }
};


module.exports = {
    managerOverview: websiteSelectors.managerOverview
};