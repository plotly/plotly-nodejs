var http = require('http')
  , version="0.0.2"
  , platform="nodejs"
  , origin="plot";


module.exports = Plotly;

function Plotly(username,api_key) {
    if (!(this instanceof Plotly))  {
        return new Plotly(username,api_key);
    }
    this.username = username;
    this.api_key = api_key;
    return this;
}



Plotly.prototype.stream = function(opts, callback) {
  if (typeof opts === "string") {
    // allow users to pass in an object or string
    opts = {token: opts}
  }
  var options = {
    host: opts.host || 'stream.plot.ly',
    port: opts.port || 80,
    path: '/',
    method: 'POST',
    agent: false,
    headers: { "plotly-streamtoken" : opts.token }
  };

  var stream = http.request(options, function(response) {
               });
  if (stream.setTimeout) stream.setTimeout(Math.pow(2, 32) * 1000);
  callback(null, stream);
  return this;
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
    layout = opts.layout || {};
    data = opts.data || [];
  }

  // allow users to just pass in an object for the data, data = {x:[],y:[]}
  if (!Array.isArray(data)) data = [data];

  var urlencoded = '',
      pack = {
        'platform': platform,
        'version': version,
        'args': JSON.stringify(data),
        'kwargs': JSON.stringify(layout),
        'un': this.username,
        'key': this.api_key,
        'origin': origin
      }

  for (var key in pack) {
    urlencoded += key + "=" + pack[key] + "&"
  }

  // trim off last ambersand
  urlencoded = urlencoded.substring(0, urlencoded.length - 1)

  var options = {
    host: opts.host || 'plot.ly',
    port: opts.port || 80,
    path: '/clientresp',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': urlencoded.length
    }
  };

  var req = http.request(options, function(res) {
     var body = ""
     res.setEncoding('utf8')
     res.on('data', function (chunk) {
           body += chunk
     });
     res.on('end', function (chunk) {
       if (chunk)
         body += chunk;
       // TODO:
       // parse the body for plotly errors
       // and format accordingly.
       // IN PARTICULAR LOOK FOR ALL STREAMS GO
       // THEN SET A msg.streams = true... so we
       // can programatically take action...
       var msg = {
         err: ""
       , message: body
       , statusCode: res.statusCode
       }
       if (res.statusCode !== 200) {
         callback(msg)
       }
       else callback(null, msg)
     })
  });

  req.on('error', function(e) {
    callback(e);
  });

    // write data to request body
  req.write(urlencoded);
  req.end();
  return this;
};

Plotly.prototype.signup = function(un, email, callback) {
  var pack = {'version': version, 'un': un, 'email': email, 'platform':platform}
    , urlencoded = '';

  for (var key in pack) {
    urlencoded += key + "=" + pack[key] + "&"
  }
  urlencoded = urlencoded.substring(0, urlencoded.length - 1)

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
