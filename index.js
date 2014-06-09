var http = require('http');
var json_status = require('./statusmsgs.json');
var url = require('url');
var request = require('request');
var fs = require('fs');
var mkdirp = require("mkdirp");
var getDirName = require("path").dirname;

module.exports = Plotly;

function Plotly(username,api_key) {
	if (!(this instanceof Plotly))  {
		return new Plotly(username,api_key);
	}

	this.username = username;
	this.api_key = api_key;
	this.host = '';
	this.version="0.0.2";
	this.platform="nodejs";
	this.origin="plot";
}

Plotly.prototype.signup = function(username, email, callback) {
	var that = this;
	if (typeof username === 'object' && typeof email === 'function') {
		opts = username;
		callback = email;
		username = opts.username;
		email = opts.email;
		host = opts.host;
	}

	if (!callback) { callback = function() {}; }

	var pack = {'version': this.version, 'un': username, 'email': email, 'platform':this.platform };
	var urlencoded = '';

	for (var key in pack) {
		urlencoded += key + "=" + pack[key] + "&";
	}
	urlencoded = urlencoded.substring(0, urlencoded.length - 1);

	var options = {
		host: opts.host || 'plot.ly',
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

Plotly.prototype.plot = function(data, graph_options, callback) {
	var opts = {};
  /*
   * permit Plotly.plot(options, callback)
   * where options is {data: [], graph_options: {}, host: host, port: port}.
   */
   if (typeof data === 'object' && typeof graph_options === 'function') {
   	opts = data;
   	callback = graph_options;
   	graph_options = opts.graph_options || {fileopt : "overwrite", filename : "node api"};
   	data = opts.data || data || [];
   	host = opts.host || 'plot.ly'
   }

   if (!callback) { callback = function() {}; }

  // allow users to just pass in an object for the data, data = {x:[],y:[]}
  if (!Array.isArray(data)) data = [data];

  var urlencoded = '';
  var pack = {
  	'platform': this.platform,
  	'version': this.version,
  	'args': JSON.stringify(data),
  	'kwargs': JSON.stringify(graph_options),
  	'un': this.username,
  	'key': this.api_key,
  	'origin': this.origin
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
  		if ( body['stream-status'] != undefined) {
  			this.host = url.parse(body['stream-host']).hostname;
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
		host: this.host || opts.host || 'stream.plot.ly',
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


Plotly.prototype.get_figure = function (file_owner, file_id, callback) {

	var opts = {};
	if (typeof file_owner === 'object' && typeof file_id === 'function') {
		opts = file_owner;
		file_owner = opts.file_owner;
		file_id = opts.file_id;
		host = opts.host || 'plot.ly';
		port = opts.port || 80;
	} else {
		host = 'plot.ly';
		port = 80;
	}

	if (!callback) { callback = function() {}; }

	var headers = {
		'plotly-username': this.username,
		'plotly-apikey': this.api_key,
		'plotly-version': this.version,
		'plotly-platform': this.platform
	};

	var resource = '/apigetfile/'+file_owner+'/'+file_id;

	var options = {
		url: 'https://' + host + resource,
		headers: headers,
		method: 'GET'
	};

	request(options, function (err, res, body) {
		if (JSON.parse(body).error) {
			callback(JSON.parse(body).error);
		} else {
			var figure = JSON.parse(body).payload.figure;
			callback(null, figure);
		}
	});
}

Plotly.prototype.save_image = function (figure, path, callback) {
	var host = 'plot.ly';

	var headers = {
		'plotly-username': this.username,
		'plotly-apikey': this.api_key,
		'plotly-version': this.version,
		'plotly-platform': this.platform
	};

	var options = {
		url: 'https://' + host + '/apigenimage/',
		headers: headers,
		method: 'POST',
		body: JSON.stringify(figure)
	};

	request.post(options, function (err, res, body) {
		if (err) {
			callback(err)
		} else {
			var image = JSON.parse(body).payload;
			writeFile(path, image, function (err) {
				if (err) {
					callback(err);
				} else {
					console.log('image saved!');
					callback(null);
				}
			});
		}
	});
}


// helper fn to create folders if they don't exist in the path
function writeFile (path, image, cb) {
	mkdirp(getDirName(path), function (err) {
		if (err) return cb(err)
			fs.writeFile(path + '.png', image, 'base64', cb)
	});
}


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
