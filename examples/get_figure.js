var plotly = require('../.')('demos','tj6mr52zgp');

plotly.get_figure('demos', '1420', function (figure) {
	// returns a JSON figure object
	console.log(figure);
});
