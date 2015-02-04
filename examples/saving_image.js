'use strict';

var fs = require('fs');
var plotly = require('../.')('your_username','your_apikey');

var trace1 = {
  x: [1, 2, 3, 4],
  y: [10, 15, 13, 17],
  type: 'scatter'
};

var trace2 = {
  x: [1, 2, 3, 4],
  y: [16, 5, 11, 9],
  type: 'scatter'
};

var figure = {
    'data': [trace1, trace2]
};

var imgOpts = {
    format: 'png',
    width: 1000,
    height: 500
};

plotly.getImage(figure, imgOpts, function (error, imageStream) {
    if (error) return console.log (error);

    var fileStream = fs.createWriteStream('1.png');
    imageStream.pipe(fileStream);
});
