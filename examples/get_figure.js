var plotly = require('../.')('username','api_key');

plotly.get_figure('file_owner', 'file_id', function (err, figure) {
	if (err) console.log(err);
	console.log(figure);
});
