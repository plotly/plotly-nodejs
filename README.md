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
	var stream = plotly.stream('your_streamtoken', function(res){
	});
	someReadableStream.pipe(stream);
});
```
###The Plotly Object has three functions:
####signup(desired_username,email)
Example:
```Javascript
var plotly = require('./plotly.js')();

var un = 'desired_username';
var email = 'your_email@email.com';

plotly.signup(un, email, function (err, msg) {
	console.log(msg);
});
```
####plot(data,layout[, callback])
Example:
```Javascript
var plotly = require('plotly')('your_username','your_apikey');

var data = [{x:[0,1,2],y:[3,2,1], type: 'bar'}];
var layout = {fileopt : "extend",filename : "node node node node"};

var options = {
	data : data,
	layout : layout
};

plotly.plot(options, function (err, msg) {
	console.log(msg);
});
```
####stream(your_streamtoken[, callback])
Example:
```Javascript
var plotly = require('./plotly.js')('your_username','your_apikey');

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


####Full REST API Documentation can be found here

[Plotly REST Documentation](https://plot.ly/api/rest/)
