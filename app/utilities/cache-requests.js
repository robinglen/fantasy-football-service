// config
var config = require('../../config/config'),
	moment = require('moment'),
	keys = {};

var cacheRequests = {
	
    generate: function(cachedRequest) {
    	var cacheStamp = moment();
    	var ttl = moment(cacheStamp).add(cachedRequest.ttl, 'milliseconds');
    	cachedRequest.cacheStamp = cacheStamp;
    	cachedRequest.ttl = ttl;
        keys[cachedRequest.url] = cachedRequest;
    },


    // basic basic cache for catching the same urls
    // could change the timestamp to now use the new dates system in fixtures

    checkKeys: function(url) {
        if (keys[url]) {

        	var timeStamp = moment();

        	if (timeStamp.isBefore(keys[url].ttl)) {
        		return keys[url].response;
        	} else {
        		keys[url] = {};
        		return false;
        	}

        } else {
        	return false;
        }
    }
    
};




module.exports = {
    cacheRequests: cacheRequests
};