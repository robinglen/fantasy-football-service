var websiteSelectors = {

    premierLeagueForm: {
        table: 'table.leagueTable tbody tr',
        row: ':nth-child(<%= number %>)',
        team: ' td.col-club',
        leaguePosition: ' td.col-rank',
        form: {
            row: ' td:nth-child(<%= number %>)',
            won: ' span.WON',
            drawn: ' span.DRAWN',
            lost: ' span.lost',
        }
    }

};


module.exports = {
    premierLeagueForm: websiteSelectors.premierLeagueForm
};