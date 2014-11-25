var config = require('../../config/config'),
    clubDetailsArr = require(config.ROOT +'/app/utilities/premier-league-globals').premierLeague.teams;

var clubDetails = (function() {


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

    return {
        searchForClubDetails:searchForClubDetails
    };

})();

module.exports = clubDetails;
