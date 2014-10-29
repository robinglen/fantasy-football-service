var websiteSelectors = {

    managerOverview: {
    		gameweekOverview: {
    			table: '.ismPrimaryNarrow section:nth-of-type(1) table tr',
    			row: ':nth-child(<%= number %>)',
    			title: ' td.ismCol1',
    			points: ' td.ismCol2',
    			rank: ' td.ismCol3',
    			transfers: ' td.ismCol4',
    			transfersCosts:' td.ismCol5',
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

            
            managerName: '.ismSection2',
            teamName: '.ismSection3',
            overallPoints: '.ismDefList.ismRHSDefList dd:nth-of-type(1)',
            overallRank: '.ismDefList.ismRHSDefList dd:nth-of-type(2)'

    }
};


module.exports = {
    managerOverview: websiteSelectors.managerOverview
};