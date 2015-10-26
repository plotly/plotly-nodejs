'use strict';

var plotly = require('../.')('username','apiKey');

plotly.deletePlot('888', function (err, msg) {
	if (err) console.log(err);
	else console.log(msg);
});
