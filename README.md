#node.js + Plotly Streaming API
Analyze and Visualize Data, Together.js
##Installation
```javascript
npm install plotly
```
##Usage
```javascript
var plotly = require('plotly')('username','api_key');

var data = [{x:[],y:[],stream:{token:'your_streamtoken',maxpoints:200}}];
var layout = {fileopt : "extend",filename : "node node"};

plotly.plot(data,layout,function() {
	var stream = plotly.stream('your_streamtoken', function(res){
	});
	someReadableStream.pipe(stream);
});
```
####Full REST API Documentation can be found [Here](https://plot.ly/api/rest/)

You can sign up for Plotly [Here](https://plot.ly/) and obtain your API key and Stream Tokens from you [Settings](https://plot.ly/settings). 

Or, you can use the `signup()` method detailed below!

#Methods
```javascript
var plotly = require('plotly')();
```
##plotly.signup(desired_username,email[, callback])
`callback(err,msg)` where `err` is an error Object, and `msg` is the return response Object	
	
The `msg` object has the following attributes : `msg.un`,`msg.api_key`,`msg.tmp_pw`,`msg.message`,`msg.statusCode`, `msg.error`	

###Example:
```javascript
var plotly = require('plotly')();

var un = 'desired_username';
var email = 'your_email@email.com';

plotly.signup(un, email, function (err, msg) {
	console.log(msg);
});
```
##plotly.plot(data,layout[, callback])
`callback(err,msg)` where `err` is an error Object, and `msg` is the return response Object	

The `msg` object has the following attributes : `msg.url`,`msg.filename`,`msg.message`,`msg.warning`,`msg.error`	
###Example:
```Javascript
var plotly = require('plotly')('your_username','your_apikey');

var data = [{x:[0,1,2],y:[3,2,1], type: 'bar'}];
var layout = {fileopt : "extend",filename : "node node node node"};
var options = { data : data, layout : layout };

plotly.plot(options, function (err, msg) {
	console.log(msg);
});
```
##plotly.stream(your_streamtoken[, callback])
`callback(res)` where `res` is a the response object with the following attributes : `res.msg`, `res.statusCode`	

###Example:
```javascript
var plotly = require('plotly')('your_username','your_apikey');

var initdata = [{x:[],y:[],stream:{token:'your_streamtoken',maxpoints:200}}];
var initlayout = {fileopt : "extend",filename : "node node node node"};
var options = { data : data, layout : layout };

plotly.plot(initdata, initlayout, function (err, msg) {
	var stream1 = plotly.stream('your_streamtoken', function (res) {
		clearInterval(iv); // once stream is closed, stop writing
	});
	var i = 0;
	var loop = setInterval(function () {
			var streamObject = JSON.stringify({ x : i, y : i });
			stream1.write(streamObject+'\n');
			i++;
	}, 1000);
});
```

###Full Example:
[Live Streaming Example](https://plot.ly/~Streaming-Demos/6/)
```javascript
/* If you have not signed up for Plotly you can do so using https://plot.ly
 * or see the example signup.js. Once you do, populate the config.json in this
 * example folder!
 */
var config = require('./config.json')
  , username = config['user']
  , apikey = config['apikey']
  , token = config['token']
  , Plotly = require('../.')(username, apikey)
  , Signal = require('random-signal')


// build a data object - see https://plot.ly/api/rest/docs for information
var data = {
    'x':[]   // empty arrays since we will be streaming our data to into these arrays
  , 'y':[]
  , 'type':'scatter'
  , 'mode':'lines+markers'
  , marker: {
      color: "rgba(31, 119, 180, 0.96)"
  }
  , line: {
      color:"rgba(31, 119, 180, 0.31)"
  }
  , stream: {
      "token": token
    , "maxpoints": 100
  }
}

// build you layout and file options
var layout = {
    "filename": "streamSimpleSensor"
  , "fileopt": "overwrite"
  , "layout": {
      "title": "streaming mock sensor data"
  }
  , "world_readable": true
}

/*
 * Call plotly.plot to set the file up.
 * If you have included a streaming token
 * you should get a "All Streams Go!" message
 */

Plotly.plot(data, layout, function (err, resp) {
    if (err) return console.log("ERROR", err)

    console.log(resp)

    var plotlystream = Plotly.stream(token, function () {})
    var signalstream = Signal({tdelta: 100})


    plotlystream.on("error", function (err) {
        signalstream.destroy()
    })

    // Okay - stream to our plot!
    signalstream.pipe(plotlystream)
})
```
