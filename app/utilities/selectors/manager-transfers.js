var websiteSelectors = {


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

    }

};


module.exports = {
    managerTransfers: websiteSelectors.managerTransfers
};