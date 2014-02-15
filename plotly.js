var http = require('http');
http.post = require('http-post');
var version="0.0.1";
var platform="node.js";
var origin="plot";

var signup = function(un, email, platform, version) {
    var all_that_data = {'version': version, 'un': un, 'email': email, 'platform':platform};
    http.post('http://plot.ly/apimkacct', all_that_data , function(res){
        res.setEncoding('utf8');
        res.on('data', function(chunk) {
            console.log(chunk);
        });
    });
};

var plot = function(args, un, key, kwargs) {
    var args_json = JSON.stringify(args);
    var kwargs_json = JSON.stringify(kwargs);
	var all_that_data = {'platform': platform, 'version': version, 'args': args_json, 'un': un, 'key': key, 'origin': origin, 'kwargs': kwargs_json};
	http.post('http://plot.ly/clientresp', all_that_data , function(res){
    res.setEncoding('utf8');
    res.on('data', function(chunk) {
        console.log(chunk);
    });
});

};

module.exports.plot = plot;
module.exports.signup = signup;




