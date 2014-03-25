/* If you have not signed up for Plotly you can do so using https://plot.ly
 * or see the example signup.js. Once you do, populate the config.json in this
 * example folder!
 */
var config = require('./config.json')
  , username = config['user']
  , apikey = config['apikey']
  , token = config['token']
  , token2 = config['token2']
  , Plotly = require('../.')(username, apikey)


var categories = ["sin", "cos", "tan"]

var data =  [{
  "name": "1/2 Hz",
  "x": [],
  "y": [],
  "type": "bar",
  "stream": {
    token: token
  }
}, {
  "name": "1 Hz",
  "x": ["sin", "cos", "tan"],
  "y": [12, 18, 29],
  "type": "bar",
  "stream": {
    token: token2
  }
}]

var layout= {
  "fileopt": 'overwrite',
  filename: 'bar fight',
  "layout":{
    "title": "Mathy Bar Fight",
    "barmode": "group",
    "xaxis": {"type": "category"},
    "yaxis": {
      "range": [-1,1]
    },
    "categories": categories
  }
}


/*
 * Call plotly.plot to set the file up.
 * If you have included a streaming token
 * you should get a "All Streams Go!" message
 */

Plotly.plot(data, layout, function (err, resp) {
  if (err) return console.log("ERROR", err);

  console.log(resp);

  var plotlystream1 = Plotly.stream(token, function () {});
  var plotlystream2 = Plotly.stream(token2, function () {});

  streamHz(plotlystream1, 0.5);
  streamHz(plotlystream2, 1);
})


function streamHz(stream, hz) {
  var ts = 0.1;
  var t = 0;

  setInterval( function () {
    var yarray = categories.map( function (func) {return Math[func](hz * t)} );
    var data = {x:categories, y: yarray};
    stream.write(JSON.stringify(data) + "\n");
    t += ts;
  }, ts * 1000)
}
