var plotly = require('../.')('username','api_key');

plotly.get_figure('file_owner', 'file_id', function (err, figure) {
	if (err) console.log(err);
	// now save that figure as a static image!
	plotly.save_image(figure, 'path/to/image_name');
});
