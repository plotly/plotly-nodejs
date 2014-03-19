var plotly = require('./plotly.js')('your_username','your_apikey');

var data = [{x:[0,1,2],y:[3,2,1], type: 'bar'}];
var layout = {fileopt : "extend",filename : "node node node node"};

var options = {
	data : data,
	layout : layout
};

plotly.plot(options, function (err, msg) {
	console.log(msg);
});

