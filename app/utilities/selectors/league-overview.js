var websiteSelectors = {

    leagueOverview : {
        title: '.ismTabHeading',
        table: '.ismStandingsTable tr',
        row: ':nth-child(<%= number %>)',
        position: {
            img: ' td:nth-child(1) img',
            unchanged: 'http://cdn.ismfg.net/static/img/new.png',
            up: 'http://cdn.ismfg.net/static/img/up.png',
            down: 'http://cdn.ismfg.net/static/img/down.png',
            selector: 'td:nth-child(2)'
        },
        team: ' td:nth-child(3)',
        manager: {
            name: ' td:nth-child(4)',
            code: ' td:nth-child(3) a'
        },
        gameweek: ' td:nth-child(5)',
        total: ' td:nth-child(6)'
    }

};


module.exports = {
    leagueOverview: websiteSelectors.leagueOverview
};