var http = require('http');
var version="0.0.2";
var platform="nodejs";
var origin="plot";
var json_status = require('./statusmsgs.json');

module.exports = Plotly;

function Plotly(username,api_key) {
    if (!(this instanceof Plotly))  {
        return new Plotly(username,api_key);
    }
    this.username = username;
    this.api_key = api_key;
    return this;
}

Plotly.prototype.signup = function(un, email, callback) {
  var that = this;
  if (typeof un === 'object' && typeof email === 'function') {
    opts = un;
    callback = email;
    un = opts.un;
    email = opts.email;
  }

  if (!callback) { callback = function() {}; }

  var pack = {'version': version, 'un': un, 'email': email, 'platform':platform };
  var urlencoded = '';

  for (var key in pack) {
    urlencoded += key + "=" + pack[key] + "&";
  }
  urlencoded = urlencoded.substring(0, urlencoded.length - 1);

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

  var req = http.request(options, function (res) {
      parseRes(res, function (err, body) {
        body = JSON.parse(body);
        if (err || res.statusCode !== 200) {
          callback({err: err, body: body, statusCode: res.statusCode});
        } else {
          that.username = body.un;
          that.api_key = body.api_key;
          callback(null, {
            un: body.un,
            api_key: body.api_key,
            tmp_pw: body.tmp_pw,
            msg: body.message,
            error: body.error,
            statusCode: res.statusCode
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

Plotly.prototype.plot = function(data, layout, callback) {
  var opts = {};
  /*
   * permit Plotly.plot(options, callback)
   * where options is {data: [], layout: {}, host: host, port: port}.
   */
  if (typeof data === 'object' && typeof layout === 'function') {
    opts = data;
    callback = layout;
    layout = opts.layout || {fileopt : "overwrite", filename : "node api"};;
    data = opts.data || [];
  }

  if (!callback) { callback = function() {}; }

  // allow users to just pass in an object for the data, data = {x:[],y:[]}
  if (!Array.isArray(data)) data = [data];

  var urlencoded = '';
  var pack = {
        'platform': platform,
        'version': version,
        'args': JSON.stringify(data),
        'kwargs': JSON.stringify(layout),
        'un': this.username,
        'key': this.api_key,
        'origin': origin
        };

  for (var key in pack) {
    urlencoded += key + "=" + pack[key] + "&";
  }

  // trim off last ambersand
  urlencoded = urlencoded.substring(0, urlencoded.length - 1);

  var options = {
    host: opts.host || 'plot.ly',
    port: opts.port || 80,
    path: '/clientresp',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': urlencoded.length
    },
    withCredentials: false
  };

  var req = http.request(options, function (res) {
    parseRes(res, function (err, body) {
      body = JSON.parse(body);
      if ( body.error.length > 0 ) {
        callback({msg: body.error, body: body, statusCode: res.statusCode});
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
  var opts = {};
   if (typeof token === "object") {
    opts = token
    token = opts.token;
  }
  var options = {
    host: opts.host || 'stream.plot.ly',
    port: opts.port || 80,
    path: '/',
    method: 'POST',
    agent: false,
    headers: { "plotly-streamtoken" : token }
  };

  if (!callback) { callback = function() {}; }

  var stream = http.request(options, function(res) {
    var message = json_status[res.statusCode];
        if (res.statusCode !== 200) {
          callback({msg : message, statusCode: res.statusCode});
        } else {
          callback(null, {msg : message, statusCode: res.statusCode});
        }
  });

  if (stream.setTimeout) stream.setTimeout(Math.pow(2, 32) * 1000);
  return stream;
};

// response parse helper fn
function parseRes (res, cb) {
  var body = '';
  if ('setEncoding' in res) {
    res.setEncoding('utf-8');
  }
  res.on('data', function (data) {
    body += data;
    if (body.length > 1e4) {
      // FLOOD ATTACK OR FAULTY CLIENT, NUKE REQ
      res.connection.destroy();
      res.writeHead(413, {'Content-Type': 'text/plain'});
      res.end("req body too large");
      return cb("body overflow");
    }
  });

  res.on('end', function () {
    cb(null, body);
  });

}
