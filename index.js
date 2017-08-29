'use strict';

var https = require('https');
var http = require('http');
var jsonStatus = require('./statusmsgs.json');
var url = require('url');

module.exports = Plotly;

function Plotly(username,apiKey) {
    if (!(this instanceof Plotly)) return new Plotly(username,apiKey);

    var opts = {};

    if (typeof username === 'object') {
        opts = username;
        this.username = opts.username;
        this.apiKey = opts.apiKey;
        this.host = opts.host || 'plot.ly';
        this.port = opts.port || 443;
    } else {
        this.username = username;
        this.apiKey = apiKey;
        this.host = 'plot.ly';
        this.port = 443;
    }
        this.streamHost = '';
        this.version='1.0.4';
        this.platform='nodejs';
        this.origin='plot';
}

Plotly.prototype.plot = function(data, graphOptions, callback) {
    var self = this;
    if (!callback) { callback = function() {}; }

    // allow users to just pass in an object for the data, data = {x:[],y:[]}
    if (!Array.isArray(data)) data = [data];

    var urlencoded = '';
    var pack = {
        'platform': self.platform,
        'version': self.version,
        'args': JSON.stringify(data),
        'kwargs': JSON.stringify(graphOptions),
        'un': self.username,
        'key': self.apiKey,
        'origin': self.origin
    };

    for (var key in pack) {
        urlencoded += key + '=' + pack[key] + '&';
    }

    // trim off last ambersand
    urlencoded = new Buffer(urlencoded.substring(0, urlencoded.length - 1), 'utf8');

    var options = {
        host: self.host,
        port: self.port,
        path: '/clientresp',
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': urlencoded.length
        },
        withCredentials: false
    };

    var req = https.request(options, function (res) {
        parseRes(res, function (err, body) {

            /* Try to parse the response */
            try {
                body = JSON.parse(body);
            } catch (e) {
                callback(e);
            }

            if ( body['stream-status'] != undefined) {
                self.streamHost = url.parse(body['stream-host']).hostname;
            }

            if ( body.error.length > 0 ) {
                var error = new Error(body.error);
                error.body = body;
                error.statusCode = res.statusCode;
                callback(error);
            } else {
                callback(null, {
                    streamstatus : body['stream-status'],
                    url: body.url,
                    message: body.message,
                    warning: body.warning,
                    filename: body.filename,
                    error: body.error
                });
            }
        });
    });

    req.on('error', function(err) {
        callback(err);
    });

    req.write(urlencoded);
    req.end();
};

Plotly.prototype.stream = function(token, callback) {
    var self = this;
    var opts = {};

    if (typeof token === 'object') {
        opts = token;
        token = opts.token;
        var host = opts.streamHost || self.streamHost;
        var port = opts.port || 80;
    }

    var options = {
        host: host || self.streamHost || 'stream.plot.ly',
        port: port || 80,
        path: '/',
        method: 'POST',
        agent: false,
        headers: { 'plotly-streamtoken' : token }
    };

    if (!callback) { callback = function() {}; }

    var stream = http.request(options, function (res) {
        var message = jsonStatus[res.statusCode];

        if (res.statusCode !== 200) {
            var error = new Error(message);
            error.statusCode = res.statusCode;
            callback(error);
        } else {
            callback(null, {msg : message, statusCode: res.statusCode});
        }
    });

    stream.on('error', function (err) {
        callback(err);
    });

    if (stream.setTimeout) stream.setTimeout(Math.pow(2, 32) * 1000);

    return stream;
};


Plotly.prototype.getFigure = function (fileOwner, fileId, callback) {
    var self = this;

    if (!callback) { callback = function() {}; }

    var headers = {
        'plotly-username': this.username,
        'plotly-apikey': this.apiKey,
        'plotly-version': this.version,
        'plotly-platform': this.platform
    };

    var resource = '/apigetfile/'+fileOwner+'/'+fileId;

    var options = {
        host: self.host,
        path: resource,
        port: self.port,
        headers: headers,
        method: 'GET'
    };

    var req = https.get(options, function (res) {
        parseRes(res, function (err, body) {

            /* Try to parse the response */
            try {
                body = JSON.parse(body);
            } catch (e) {
                callback(e);
            }
            
            if (body.error) {
                callback(body.error);
            }

            else {
                var figure = body.payload.figure;
                callback(null, figure);
            }

        });
    });

    req.on('error', function (err) {
        callback(err);
    });

    req.end();
};

Plotly.prototype.getImage = function (figure, opts, callback) {
    callback = callback || function () {};
    if (!figure) return new Error('no figure provided!');

    var self = this;
    var payload = JSON.stringify({
        figure: figure,
        format: opts.format || 'png',
        width: opts.width || 700,
        height: opts.height || 500
    });

    var headers = {
        'plotly-username': self.username,
        'plotly-apikey': self.apiKey,
        'plotly-version': self.version,
        'plotly-platform': self.platform,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': payload.length
    };

    var options = {
        hostname: self.host,
        path : '/apigenimage/',
        port: self.port,
        headers: headers,
        method: 'POST',
        agent: false
    };

    function handleResponse(res) {
        if (res.statusCode !== 200) {
            var error = new Error('Bad response status code ' + res.statusCode);
            error.msg = res.body;
            return callback(error, null);
        }

        callback(null, res);
    }

    var req = https.request(options, handleResponse);

    req.on('error', function (err) {
        callback(err);
    });

    req.write(payload);
    req.end();
};

Plotly.prototype.deletePlot = function (fid, callback) {
    if (!callback) callback = function () {};

    var self = this;

    // Create the base64 authstring from buffer
    var encodedAPIAuth = new Buffer(this.username + ':' + this.apiKey).toString('base64');

    var options = {
        host: 'api.plot.ly',
        port: this.port,
        path: '/v2/files/' + this.username + ':' + fid + '/trash',
        method: 'POST',
        agent: false,
        withCredentials: true,
        headers: {
            'Plotly-Client-Platform': 'nodejs ' + this.version,
            'authorization': 'Basic ' + encodedAPIAuth
        }
    };

    var req = https.request(options, function (res) {
        parseRes(res, function (err, body) {

            if (res.statusCode === 200) {

                callback(null, body);

            } else {

                var errObj = {
                    statusCode: res.statusCode,
                    err: body,
                    statusMessage: res.statusMessage
                };

                callback(errObj); // Pass out the error message from the backend
            }

        });
    });

    req.on('error', function (err) {
        callback(err);
    });

    req.end();
};

// response parse helper fn
function parseRes (res, cb) {
    var body = '';
    if ('setEncoding' in res) res.setEncoding('utf-8');

    res.on('data', function (data) {
        body += data;
        if (body.length > 1e10) {
            // FLOOD ATTACK OR FAULTY CLIENT, NUKE REQ
            res.connection.destroy();
            res.writeHead(413, {'Content-Type': 'text/plain'});
            res.end('req body too large');
            return cb(new Error('body overflow'));
        }
    });

    res.on('end', function () {
        cb(null, body);
    });

}
