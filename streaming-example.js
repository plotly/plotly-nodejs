var plotly = require('./plotly.js')('your_username','your_apikey');

var initdata = [{x:[],y:[],stream:{token:'your_streamtoken',maxpoints:200}}];
var initlayout = {fileopt : "extend",filename : "node node node node"};

var options = {
	data : data,
	layout : layout
};

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

