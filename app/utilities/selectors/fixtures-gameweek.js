var websiteSelectors = {

    fixturesGameweek: {
        table: 'table.ismFixtureTable tbody tr',
        title: 'table.ismFixtureTable .ismStrongCaption',
        row: ':nth-child(<%= number %>)',
        fixture: 'ismFixture',
        fixtures: {
            date: ' td:nth-child(1)',
            home: ' td:nth-child(2)',
            score: ' td:nth-child(4)',
            away: ' td:nth-child(6)'
        }
    }


};


module.exports = {
    fixturesGameweek: websiteSelectors.fixturesGameweek
};