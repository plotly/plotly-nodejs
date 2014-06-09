var plotly = require('../.')('demos','tj6mr52zgp');

plotly.get_figure('demos', '1023', function (figure) {
	console.log(figure);
});
