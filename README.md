#node.js + Plotly Streaming API
Analyze and Visualize Data, Together.js
```Javascript
npm install plotly
```
###Usage
```Javascript
var plotly = require('plotly')('username','api_key');

var data = [{x:[],y:[],stream:{token:'your_streamtoken',maxpoints:200}}];
var layout = {fileopt : "extend",filename : "node node"};

plotly.plot(data,layout,function() {
	plotly.stream('your_streamtoken', function(err,stream){
		someReadableStream.pipe(stream);
	});
});
```
###The Plotly Object has three functions:
####signup(desired_username,email)
Example:
```Javascript
var plotly = require('plotly');
plotly.signup('some_clever_username','your@email.com')
```
####plot(data,layout[, callback])
Example:
```Javascript
var plotly = require('plotly')('username','api_key');

var data = [{x:getSomeX,y:getSomeY}];
var layout = {filename : 'node node'};

plotly.plot(data,layout,function() {
	// Do some things after the POST	
});
```
####stream(your_streamtoken[, callback])
Example:
```Javascript
var plotly = require('plotly')('username','api_key');

var initdata = [{x:[],y:[],stream:{token:'your_streamtoken',maxpoints:200}}];
var initlayout = {fileopt : "extend",filename : "node node"};

plotly.plot(initdata,initlayout,function() {
	plotly.stream('your_stream_token', function(err,stream) {
		// Start Streaming!
		getReadableStream.pipe(stream);
	});
});
```


####Full REST API Documentation can be found here

[Plotly REST Documentation](https://plot.ly/api/rest/)
