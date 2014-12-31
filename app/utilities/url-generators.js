var config = require('../../config/config'), 
  _ = require('lodash');

var urlGenerators = (function() {


  function generatePremierLeagueFormURLs() {
        return 'http://www.premierleague.com/en-gb/matchday/form-guide.html?tableView=homeAwayTotalComparison';
    }


  function generateGameweekFixturesURLs(opts) {
      if (opts.gameweek) {
          var url = _.template('http://fantasy.premierleague.com/fixtures/<%= gameweek %>/');
          return  url({ 'gameweek': opts.gameweek});
      } else {
        return 'http://fantasy.premierleague.com/fixtures';
      }
    }


  function generateLeagueURLs(opts) {
      var url = _.template('http://fantasy.premierleague.com/my-leagues/<%= leagueId %>/standings/');

      return  url({ 'leagueId': opts.leagueId});
    }


  function generateManagerURLs(opts, page) {
      switch(page) {
        case 'transfers':
          // in and out -  include player ID in response, get from href
          url = _.template('http://fantasy.premierleague.com/entry/<%= managerId %>/transfers/history/');
          break;
        case  'overview':
          // historic data, data about manger, team supported, country etc
          url = _.template('http://fantasy.premierleague.com/entry/<%= managerId %>/history/');
          break;
        case  'gameweek':
          // all information about the week, link to players
          url = _.template('http://fantasy.premierleague.com/entry/<%= managerId %>/event-history/<%= gameweek %>');
          break;
        }
      return  url({ 'managerId': opts.managerId, 'gameweek':opts.gameweek });
    }

  function collectCodeFromUrl(url,splitBefore) {
    return url.split(splitBefore)[1].split('/')[0]
  }

  return {
    generatePremierLeagueFormURLs:generatePremierLeagueFormURLs,
    generateManagerURLs:generateManagerURLs,
    generateLeagueURLs:generateLeagueURLs,
    generateGameweekFixturesURLs:generateGameweekFixturesURLs,
    collectCodeFromUrl:collectCodeFromUrl
  };

})();

module.exports = urlGenerators;
