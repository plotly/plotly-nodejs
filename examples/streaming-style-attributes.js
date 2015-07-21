var config = require('./config.json'),
    username = config.user,
    apikey = config.apikey,
    tokens = config.tokens,
    Plotly = require('../.')(username, apikey);

function initTrace(token) {
    return {
        x: [],  // init. data arrays
        y: [],
        type: 'scatter',
        mode: 'markers',
        marker: { color: '#91C149' },
        stream: {
            'token': token,
            'maxpoints': 100
        }
    };
}

var data = tokens.map(initTrace);

var layout = {
    filename: 'stream-style-attributes',
    fileopt: 'overwrite',
    layout: {
      title: 'streaming data <i>and</i> style attributes'
    },
    world_readable: true
};

Plotly.plot(data, layout, function(err, resp) {
    if(err) return console.log('ERROR', err, data);
    console.log(resp);

    tokens.forEach(function(token) {
        var plotlystream = Plotly.stream(token, function() {
                clearInterval(loop);
            }),
            i = 0;

        var loop = setInterval(function() {
            var streamData = {
                x: Math.random(),
                y: 2 * Math.random(),
                marker: { color: '#91C149' }
            };

            // pts below threshold get a different color
            if(streamData.y < 1) streamData.marker.color = '#000000';

            plotlystream.write(JSON.stringify(streamData) + '\n');
            i++;

        }, 1000);
    });
});
