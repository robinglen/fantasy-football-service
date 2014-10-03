'use strict';
var express = require('express');

//Express
var app = express();

//app.use(express.static(__dirname, 'dist')); //  "public" off of current is root

app.use(express.static('./dist'));

var flApp = app.listen(3000, function() {
    console.log('Listening on port %d', flApp.address().port);
});

app.all('/*', function(req, res) {
    res.sendFile('index.html', { root: 'dist' });
});

