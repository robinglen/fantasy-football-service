// config
var config  = require('../../config/config'),
	request = require('request'),
	cheerio = require('cheerio');

module.exports.collectHTML = function(url, callback) {
	request({
		url: url
	}, function (err, res, body) {
		if (!err) {
			if (parseInt(res.statusCode, 10) === 200) {
				var cheerioResponse = cheerio.load(body);
				callback(err, {res:res,body:cheerioResponse});
			} else {
				callback(err, {res:res,body:body});
			}
		} else {
			callback(err, {res:res,body:body});
		}
	});
}
