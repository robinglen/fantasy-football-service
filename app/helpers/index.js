var config = require('../../config/config');
var _ = require('lodash');
var clubDetailsArr = require(config.ROOT +'/app/utilities/premier-league-globals').premierLeague.teams;

var helpers = (function() {


    function searchForClubDetails(value, searchTerm) {
    	var clubDetailsObj = {
    		error: value + ' could not be found'
    	};
        clubDetailsArr.forEach(function(club,i){
    		if (club[searchTerm]===value) {
    			club.code = i+1;
    			clubDetailsObj = club;
    		}          
        })
    	return clubDetailsObj;
    }


	function collectCodeFromUrl(url,splitBefore) {
		return url.split(splitBefore)[1].split('/')[0]
	}


	return {
		collectCodeFromUrl:collectCodeFromUrl,
		searchForClubDetails:searchForClubDetails
	};

})();

module.exports = helpers;
