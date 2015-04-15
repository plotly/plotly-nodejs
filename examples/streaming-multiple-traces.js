var config = require('./config.json'),
    username = config.user,
    apikey = config.apikey,
    tokens = config.tokens,
    Plotly = require('../.')(username, apikey),
    Signal = require('random-signal');

function initTrace(i) {
    return {
        x: [],  // init. data arrays
        y: [],
        type: 'scatter',
        mode: 'lines+markers',
        stream: {
            "token": tokens[i],
            "maxpoints": 100
        }
    };
}

var data = [0, 1].map(initTrace);

var layout = {
    filename: "stream-multiple-traces",
    fileopt: "overwrite",
    layout: {
      title: "streaming mock sensor data"
    },
    world_readable: true
};


Plotly.plot(data, layout, function (err, resp) {
    if (err) return console.log("ERROR", err, data);
    console.log(resp);

    [0, 1].forEach(function(i) {
        var plotlystream = Plotly.stream(tokens[i], function() {}),
            signalstream = Signal({tdelta: 100});

        plotlystream.on("error", function (err) { signalstream.destroy(); });

        signalstream.pipe(plotlystream);
    });

});
