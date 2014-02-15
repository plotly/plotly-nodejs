##Simple node.js Wrapper for the Plotly API.

###Installation
```Javascript
npm install plotly
```
###Usage
```Javascript
var plotly = require('plotly');
```
###There are two main functions, all arguments are required.

```Javascript
plotly.signup('desired_username', 'your@email.com')

plotly.plot(data, username_or_email, api_key, layout)
```

###Plotting Example
```Javascript
var plotly = require('plotly');

var un= "your_username";
var key= "your_api_key";

var data= [{
	"x": [1, 2, 3, 4],
	"y": [10, 15, 13, 17],
	"type": "scatter"
}];

var layout = {
	"filename": "node node node node",
	"fileopt": "new",
	"layout": {
		"title": "experimental node data"
	},
	"world_readable": true
};

plotly.plot(data, un, key, layout);
```

###Example Response
```JSON
{"url": "http://plot.ly/~demos/1324",
"message": "",
"warning": "",
"filename": "node node node node",
"error": ""}
```

Go ahead and copy and paste the link into your browser to check out your graph!


### Full REST API Documentation can be found here

[Plotly REST Documentation](https://plot.ly/api/rest/)