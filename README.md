#Plotly Node API
> Analyze and Visualize Data, Together		
	
	
If you have a question about streaming let us know or open an issue!	

`ben@plot.ly` && `alexandre@plot.ly`

## Streaming Plot Examples
- [mock sensor stream](http://plot.ly/~streaming-demos/6/)
- [math bar fight](http://plot.ly/~streaming-demos/44/)

##Installation
```javascript
npm install plotly
```

##Usage
```javascript
var plotly = require('plotly')('username','api_key');

var data = [{x:[], y:[], stream:{token:'your_streamtoken', maxpoints:200}}];
var graph_options = {fileopt : "extend", filename : "nodenodenode"};

plotly.plot(data,graph_options,function() {
  var stream = plotly.stream('your_streamtoken', function (res) {
    console.log(res);
  });
  someReadableStream.pipe(stream);
});
```

####Full REST API Documentation can be found here: [https://plot.ly/api/rest/](https://plot.ly/api/rest/)

Sign up for plotly here: [https://plot.ly/](https://plot.ly/) and obtain your API key and Stream Tokens in your plotly settings: [https://plot.ly/settings](https://plot.ly/settings). 

Or, you can use the `signup()` method detailed below.

#Methods
##var plotly = require('plotly')(username, api_key)
`username` is a string containing your username    
`api_key` is a string containing your API key   
```javascript
var plotly = require('plotly')();
```

##plotly.signup(desired_username,email[, callback])
`desired_username` is a string representing your desired Plotly username    
`email` is string containing your e-mail address    
`callback(err,msg)` where `err` is an error Object, and `msg` is the return response Object	 
	
The `msg` object has the following attributes : `msg.un`,`msg.api_key`,`msg.tmp_pw`,`msg.message`,`msg.statusCode`, `msg.error`	

```javascript
// examples/signup-example.js

var plotly = require('plotly')();

var un = 'desired_username';
var email = 'your_email@email.com';

plotly.signup(un, email, function (err, msg) {
	console.log(msg);
});
```

##plotly.plot(data,graph_options[, callback])
Plotly graphs are described declaratively with a data JSON Object and a graph_options JSON Object. 
`data` is an array of Objects and with each object containing data and styling information of separate graph traces. Docs: [https://plot.ly/api/rest](https://plot.ly/api/rest)  
`graph_options` is an Object containing styling options like axis information and titles for your graph. Docs: [https://plot.ly/api/rest](https://plot.ly/api/rest)  
`callback(err,msg)` where `err` is an error Object, and `msg` is the return response Object	

The `msg` object has the following attributes : `msg.url`,`msg.filename`,`msg.message`,`msg.warning`,`msg.error`	
```javascript
// examples/rest-example.js

var plotly = require('plotly')('your_username','your_apikey');

var data = [{x:[0,1,2], y:[3,2,1], type: 'bar'}];
var graph_options = {fileopt : "extend", filename : "nodenodenode"};

plotly.plot(data, graph_options, function (err, msg) {
	console.log(msg);
});
```
##var stream = plotly.stream(token[, callback])
`token` accepts a token string   
`callback(res)` where `res` is a the response object with the following attributes : `res.msg`, `res.statusCode`

```javascript
// examples/streaming-example.js
var plotly = require('plotly')('your_username','your_apikey');

var initdata = [{x:[], y:[], stream:{token:'token', maxpoints:200}}];
var initgraph_options = {fileopt : "extend", filename : "nodenodenode"};

plotly.plot(initdata, initgraph_options, function (err, msg) {
  if (err) return console.log(err)
  console.log(msg);

  var stream1 = plotly.stream('token', function (err, res) {
    console.log(err, res);
    clearInterval(loop); // once stream is closed, stop writing
  });

  var i = 0;
  var loop = setInterval(function () {
      var streamObject = JSON.stringify({ x : i, y : i });
      stream1.write(streamObject+'\n');
      i++;
  }, 1000);
});
```

[Live Streaming Example](https://plot.ly/~Streaming-Demos/6/)
```javascript
// examples/signal-stream.js

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

// build your layout and file options
var graph_options = {
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

Plotly.plot(data, graph_options, function (err, resp) {
    if (err) return console.log("ERROR", err)

    console.log(resp)

    var plotlystream = Plotly.stream(token, function () {})
    var signalstream = Signal({tdelta: 100}) // 


    plotlystream.on("error", function (err) {
        signalstream.destroy()
    })

    // Okay - stream to our plot!
    signalstream.pipe(plotlystream)
})
```


##var plotly.get_figure(file_owner, file_id[, callback])
`file_ownder` accepts a string of the file owners name   
`file_id` is an integer, representing the graph ID.
`callback(figure)` where `figure` is a the JSON object of the graph figure.

```javascript
var plotly = require('plotly')('your_username','your_apikey');

plotly.get_figure('file_owner', 'file_id', function (figure) {
    console.log(figure);
});
```
