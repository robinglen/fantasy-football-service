var websiteSelectors = {

    premierLeagueForm: {
        table: 'table.leagueTable tbody tr',
        row: ':nth-child(<%= number %>)',
        team: ' td.col-club',
        leaguePosition: ' td.col-rank',
        form: {
            row: ' td:nth-child(<%= number %>)',
            matches: ' span',
            won: '.WON',
            drawn: '.DRAWN',
            lost: '.LOST'
        }
    }

};


module.exports = {
    premierLeagueForm: websiteSelectors.premierLeagueForm
};