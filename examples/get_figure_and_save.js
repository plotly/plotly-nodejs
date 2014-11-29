var plotly = require('../.')('username','api_key');

plotly.getFigure('fileOwner', 'fileId', function (err, figure) {
    if (err) console.log(err);

    var payload = {
        'figure': figure
    };

    // now save that figure as a static image!
    plotly.saveImage(payload, 'path/to/image', function(err) {
        if (err)
            console.log(err);
        else
            console.log("Image saved!");
    });
});
