var plotly = require('../.')('your_username','your_apikey');

var data = [{x:[0,1,2], y:[3,2,1], type: 'bar'}];
var layout = {fileopt : "extend", filename : "nodenodenode"};

plotly.plot(data, layout, function (err, msg) {
	console.log(msg);
});

