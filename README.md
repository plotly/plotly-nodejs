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

###Example
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