##Simple node.js Wrapper for the Plotly API.

###Installation
```Javascript
npm install plotly
```
###Usage
```Javascript
var plotly = require('plotly')('username','api_key');

var data = [{x:[],y:[],stream:{token:'your_streamtoken',maxpoints:200}}];
var layout = {fileopt : "extend",filename : "node node"};

plotly.plot(data,layout,function() {
	plotly.stream('', function(err,stream){
		somereadablestream.pipe(stream);
	});
});
```

### Full REST API Documentation can be found here

[Plotly REST Documentation](https://plot.ly/api/rest/)
