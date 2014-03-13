var http = require('http');

var version="0.0.2";
var platform="nodejs";
var origin="plot";

function Plotly(username,api_key) {
    if (!(this instanceof Plotly))  {
        return new Plotly(username,api_key);
    }
    this.username = username;
    this.api_key = api_key;
    return this;
}

Plotly.prototype.stream = function(token,callback) {
    var headers = { "plotly-streamtoken" : token };
    var options = {
        host: 'stream.plot.ly',
        port: 80,
        path: '/',
        method: 'POST',
        headers: headers
    };

    var stream = http.request(options, function(response) {
    });

    callback(null,stream);
    return this;
};

Plotly.prototype.plot = function(data,layout,callback) {
    var all_that_data = {
        'platform': platform,
        'version': version,
        'args': JSON.stringify(data),
        'kwargs': JSON.stringify(layout),
        'un': this.username,
        'key': this.api_key,
        'origin': origin
    };

    var urlencoded = "un="+all_that_data.un+"&key="+all_that_data.key+"&origin="+all_that_data.origin+"&platform="+all_that_data.platform+"&args="+all_that_data.args+"&kwargs="+all_that_data.kwargs+"&version="+all_that_data.version;

    var options = {
        host: 'plot.ly',
        port: 80,
        path: '/clientresp',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': urlencoded.length
        }
    };

    var req = http.request(options, function(res) {
        console.log('STATUS: ' + res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(res.headers));

        res.on('data', function (chunk) {
            console.log('Response from Plot.ly: '+'\n'+chunk);
        });

    });

    req.on('error', function(e) {
        console.log('problem with request: ' + e.message);
    });

    // write data to request body
    req.write(urlencoded);
    req.end();

    callback();
    return this;
};

Plotly.prototype.signup = function(un, email, callback) {
    var all_that_data = {'version': version, 'un': un, 'email': email, 'platform':platform};
    var urlencoded = "un="+all_that_data.un+"&email="+all_that_data.email+"&platform="+all_that_data.platform+"&version="+all_that_data.version;
    var options = {
        host: 'plot.ly',
        port: 80,
        path: '/apimkacct',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': urlencoded.length
        }
    };

    var req = http.request(options, function(res) {
        console.log('STATUS: ' + res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(res.headers));

        res.on('data', function (chunk) {
            console.log('Response from Plot.ly: '+'\n'+chunk);
        });

    });

    req.on('error', function(e) {
        console.log('problem with request: ' + e.message);
    });

    // write data to request body
    req.write(urlencoded);
    req.end();

    if (callback) {
       callback();
    }

    return this;

};

module.exports = Plotly;







