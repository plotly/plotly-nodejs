'use strict';

var plotly = require('../.')('username','api_key');

plotly.getFigure('file_owner', 'file_id', function (err, figure) {
    if (err) return console.log(err);
    return console.log(figure);
});
