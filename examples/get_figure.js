var plotly = require('../.')('username','api_key');

plotly.getFigure('file_owner', 'file_id', function (err, figure) {
    if (err)
        console.log(err);
    else
        console.log(figure);
});
