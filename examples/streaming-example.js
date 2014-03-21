var plotly = require('../.')('your_username','your_apikey');

var initdata = [{x:[], y:[], stream:{token:'your_streamtoken', maxpoints:200}}];
var initlayout = {fileopt : "extend", filename : "nodenodenode"};

plotly.plot(initdata, initlayout, function (err, msg) {
  if (err) {
    return console.log(err);
  }
  console.log(msg);

	var stream1 = plotly.stream('your_streamtoken', function (err, res) {
    if (err) {
      console.log(err);
    } else {
      console.log(res);
    }
		clearInterval(loop); // once stream is closed, stop writing
	});

	var i = 0;
	var loop = setInterval(function () {
			var streamObject = JSON.stringify({ x : i, y : i });
			stream1.write(streamObject+'\n');
			i++;
	}, 1000);
});

