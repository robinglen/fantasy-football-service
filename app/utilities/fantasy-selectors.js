var websiteSelectors = {

    managerOverview: {
            managerName: '.ismSection2',
            teamName: '.ismSection3',
            overallPoints: '.ismDefList.ismRHSDefList dd:nth-of-type(1)',
            overallRank: '.ismDefList.ismRHSDefList dd:nth-of-type(2)',        
    		gameweekOverview: {
    			table: '.ismPrimaryNarrow section:nth-of-type(1) table tr',
    			row: ':nth-child(<%= number %>)',
    			title: ' td.ismCol1',
    			points: ' td.ismCol2',
    			rank: ' td.ismCol3',
    			value: ' td.ismCol6',
				overallPoints: ' td.ismCol7',
				overallRank: ' td.ismCol8',
				position: {
					img: ' td.ismCol9 img',
					unchanged: 'http://cdn.ismfg.net/static/img/new.png',
					up: 'http://cdn.ismfg.net/static/img/up.png',
					down: 'http://cdn.ismfg.net/static/img/down.png'
				}
    		},
    		careerHistory: {
    			table: '.ismPrimaryNarrow section:nth-of-type(2) table tr',
    			row: ':nth-child(<%= number %>)',
    			season: ' td.ismCol1',
    			points: ' td.ismCol2',
    			rank: ' td.ismCol3'
    		},
            classicLeagues :{
                table: '.ismTable.ismLeagueTable:nth-of-type(1) tr',
                row: ':nth-child(<%= number %>)',
                position: {
                    img: ' td:nth-of-type(1) img',
                    rank:' td:nth-of-type(2)',
                    unchanged: 'http://cdn.ismfg.net/static/img/new.png',
                    up: 'http://cdn.ismfg.net/static/img/up.png',
                    down: 'http://cdn.ismfg.net/static/img/down.png'
                },
                league: ' td:nth-of-type(3) a'
            }

    },

    managerTransfers: {
        wildcard: {
            table: '.ismPrimaryNarrow .ismTable:nth-of-type(2) tbody tr',
            date: '.ismPrimaryNarrow .ismTable:nth-of-type(2) tr th:nth-of-type(1)',
            row: ':nth-child(<%= number %>)',
            status: ' td:nth-child(2)'
        },
        transferHistory: {
            table: '.ismPrimaryNarrow .ismTable:nth-of-type(1) tr',
            row: ':nth-child(<%= number %>)',
            date: ' td:nth-child(1)',
            playerOut: ' td:nth-child(2)',
            playerIn: ' td:nth-child(3)',
            gameWeek: ' td:nth-child(4)'
        }

    },

    managerGameweek: {
        gameweekPoints: {
            selector: '.ismSBPrimary div',
            split: 'pts'
        },
        gameweekAveragePoints: {
            selector: '.ismSBSecondaryVal',
            split: 'pts'            
        },
        gameweekHighestPoints: {
            selector: '.ismStatLink',
            split: 'pts'              
        },
        teamSheet: {
            pitch:'.ismPitchContainer',
            goalkeeper: '.ismPitchRow1 .ismPitchCell:nth-of-type(3)',
            defence: '.ismPitchRow2',
            midfield: '.ismPitchRow3',
            attack: '.ismPitchRow4',
            bench: '.ismBench',
            player: {
                name: '.ismElementDetail .ismPitchWebName',
                club: {
                    name: '.ismShirtContainer img'
                },
                dreamteam: {
                    selector: '.JS_ISM_DREAMTEAM a',
                    hasClass: 'ismDreamTeam'
                },
                cell: '.ismPitchCell',
                json: {
                    selector:  '.ismPitchElement',
                    split: 'ismPitchElement'
                },
            }
        }
    }

};


module.exports = {
    managerOverview: websiteSelectors.managerOverview,
    managerTransfers: websiteSelectors.managerTransfers,
    managerGameweek: websiteSelectors.managerGameweek
};