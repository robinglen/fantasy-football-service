var config = require('../../config/config'),
    _ = require('lodash'),
    leagueOverviewSelectors = require(config.ROOT +'/app/utilities/selectors/league-overview').leagueOverview,
    selectorUtils = require(config.ROOT +'/app/utilities/selector-utils').selectorUtils();

  var responseGeneration = {
    buildleagueOverviewResponse: function (cheerioBody,leagueId) {
      var $ = cheerioBody,
      tableRows = $(leagueOverviewSelectors.table).length + 1,
      arr = [];
      // map each team to an object
      for (i = 3; i <= tableRows; i++) { 
        var leagueRow = _.template(leagueOverviewSelectors.row,{number:i}),
          leagueRowSelector = leagueOverviewSelectors.table + leagueRow,
          obj = {
            positionMovement: selectorUtils.checkPositionMovement($(leagueRowSelector + leagueOverviewSelectors.position.img).attr('src'),leagueOverviewSelectors.position),
            team: $(leagueRowSelector + leagueOverviewSelectors.team).text(), 
            manager: {
              name: $(leagueRowSelector + leagueOverviewSelectors.manager.name).text(),
              id: $(leagueRowSelector + leagueOverviewSelectors.manager.code).attr('href').split('/entry/')[1].split('/')[0]
            },
            gameWeek: Number($(leagueRowSelector + leagueOverviewSelectors.gameweek).text()),
            total: $(leagueRowSelector + leagueOverviewSelectors.total).text(),
          }
        arr.push(obj)
      }
      return {
        title: $(leagueOverviewSelectors.title).text(),
        id: leagueId,
        teams: arr
      }
    }

  };

module.exports = {
    responseGeneration: responseGeneration
};