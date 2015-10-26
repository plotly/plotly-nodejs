#Plotly Node API
[![Circle CI](https://circleci.com/gh/plotly/plotly-nodejs/tree/master.svg?style=svg)](https://circleci.com/gh/plotly/plotly-nodejs/tree/master)
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
var plotly = require('plotly')('username','apiKey');

var data = [{x:[], y:[], stream:{token:'yourStreamtoken', maxpoints:200}}];
var graphOptions = {fileopt : "extend", filename : "nodenodenode"};

plotly.plot(data,graphOptions,function() {
  var stream = plotly.stream('yourStreamtoken', function (res) {
    console.log(res);
  });
  someReadableStream.pipe(stream);
});
```

####Full REST API Documentation can be found here: [https://plot.ly/api/rest/](https://plot.ly/api/rest/)

Sign up for plotly here: [https://plot.ly/](https://plot.ly/) and obtain your API key and Stream Tokens in your plotly settings: [https://plot.ly/settings](https://plot.ly/settings).

#Methods
##var plotly = require('plotly')(username, apiKey)
`username` is a string containing your username
`apiKey` is a string containing your API key
```javascript
var plotly = require('plotly')('username', 'apiKey');
```

##plotly.plot(data,graphOptions[, callback])
Plotly graphs are described declaratively with a data JSON Object and a graphOptions JSON Object.
`data` is an array of Objects and with each object containing data and styling information of separate graph traces. Docs: [https://plot.ly/api/rest](https://plot.ly/api/rest)  
`graphOptions` is an Object containing styling options like axis information and titles for your graph. Docs: [https://plot.ly/api/rest](https://plot.ly/api/rest)  
`callback(err,msg)` where `err` is an error Object, and `msg` is the return response Object

The `msg` object has the following attributes : `msg.url`,`msg.filename`,`msg.message`,`msg.warning`,`msg.error`
```javascript
// examples/rest-example.js

var plotly = require('plotly')('username','apiKey');

var data = [{x:[0,1,2], y:[3,2,1], type: 'bar'}];
var graphOptions = {fileopt : "extend", filename : "nodenodenode"};

plotly.plot(data, graphOptions, function (err, msg) {
    console.log(msg);
});
```
##var stream = plotly.stream(token[, callback])
`token` accepts a token string
`callback(res)` where `res` is a the response object with the following attributes : `res.msg`, `res.statusCode`

```javascript
// examples/streaming-example.js
var plotly = require('plotly')('username','apiKey');

var initData = [{x:[], y:[], stream:{token:'token', maxpoints:200}}];
var initGraphOptions = {fileopt : "extend", filename : "nodenodenode"};

plotly.plot(initData, initGraphOptions, function (err, msg) {
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
  , apiKey = config['apiKey']
  , token = config['token']
  , Plotly = require('../.')(username, apiKey)
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
var graphOptions = {
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

Plotly.plot(data, graphOptions, function (err, resp) {
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


##plotly.getFigure(fileOwner, fileId[, callback])
`file_owner` accepts a string of the file owner's name
`fileId` is an integer, representing the graph ID
`callback(figure)` where `figure` is a the JSON object of the graph figure

```javascript
var plotly = require('plotly')('username','apiKey');

plotly.getFigure('fileOwner', 'fileId', function (err, figure) {
    if (err) console.log(err);
    console.log(figure);
});
```

##plotly.getImage(figure[, options, callback])
`figure` is a JSON object of the graph figure
`options.format` | `jpg`, `png`, `pdf`, `eps`, `webp`
`options.width` | width in `px` (default : 700)
`options.height` | height in `px` (default : 500)

`callback(err, imageData)`  

`err` is an Error Object
`imageStream` is a Stream of base-64 encoded imageData

```javascript
var plotly = require('plotly')('username','apiKey');
var fs = require('fs');

var trace1 = {
  x: [1, 2, 3, 4],
  y: [10, 15, 13, 17],
  type: "scatter"
};

var figure = { 'data': [trace1] };

var imgOpts = {
    format: 'png',
    width: 1000,
    height: 500
};

plotly.getImage(figure, imgOpts, function (error, imageStream) {
    if (error) return console.log (error);

    var fileStream = fs.createWriteStream('1.png');
    imageStream.pipe(fileStream);
});
```

You can also use `getFigure()` and `getImage()` together!
```javascript
var plotly = require('../.')('username','apiKey');

// grab the figure from an existing plot
plotly.getFigure('fileOwner', 'fileId', function (err, figure) {
	if (err) return console.log(err);

	var imgOpts = {
		format: 'png',
		width: 1000,
		height: 500
	};

    plotly.getImage(figure, imgOpts, function (error, imageStream) {
        if (error) return console.log (error);

        var fileStream = fs.createWriteStream('2.png');
        imageStream.pipe(fileStream);
    });
});
```

##plotly.deletePlot(fid[, callback])
`fid` is a String, the id of the plot you wish you delete
`callback` is a function with `err` and `plot` as parameters. `err`, if present, is the error message returned from the request. `plot` is the plot that was deleted.

```javascript
var plotly = require('../.')('username','apiKey');

plotly.deletePlot('88', function (err, plot) {
    if (err) console.log(err)
    else console.log(plot);
});
```
