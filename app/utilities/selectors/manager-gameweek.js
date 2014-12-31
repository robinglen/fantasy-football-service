var websiteSelectors = {


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
    managerGameweek: websiteSelectors.managerGameweek
};