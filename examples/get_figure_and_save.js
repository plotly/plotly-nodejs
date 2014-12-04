'use strict';

var plotly = require('../.')('username','api_key');

plotly.getFigure('fileOwner', 'fileId', function (err, figure) {
    if (err) console.log(err);

    // now save that figure as a static image!
    plotly.saveImage(figure, 'path/to/image', function(err) {
        if (err) return console.log(err);
        return console.log('Image saved!');
    });
});
