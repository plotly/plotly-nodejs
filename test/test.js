'use strict';

var test = require('tape');

test('makes a rest call', function (t) {
    t.plan(2);

    var plotly = require('../index')('node-test-account', 'tpmz9ye8hg');
    var data = [{x:[0,1,2], y:[3,2,1], type: 'bar'}];
    var layout = {fileopt : 'overwrite', filename : 'nodenodenodetest'};

    plotly.plot(data, layout, function (err, msg) {
        t.isEqual(msg.url, 'https://plot.ly/~node-test-account/0', 'url matches');
        t.notOk(err ,'no error');
        t.end();
    });
});

test('makes a rest call', function (t) {
    t.plan(2);

    var options = {
        username: 'node-test-account',
        apiKey: 'tpmz9ye8hg',
        host: 'plot.ly',
        port: 443
    };

    var plotly = require('../index')(options);
    var data = [{x:[0,1,2], y:[3,2,1], type: 'bar'}];
    var layout = {fileopt : 'overwrite', filename : 'nodenodenodetest'};

    plotly.plot(data, layout, function (err, msg) {
        t.isEqual(msg.url, 'https://plot.ly/~node-test-account/0', 'url matches');
        t.notOk(err ,'no error');
        t.end();
    });
});

test('makes a rest call', function (t) {
    t.plan(2);
    var plotly = require('../index')('node-test-account', 'tpmz9ye8hg');
    var data = [{x:[0,1,2], y:[3,2,1], type: 'bar'}];
    var layout = {fileopt : 'overwrite', filename : 'nodenodenodetest'};

    plotly.plot(data, layout, function (err, msg) {
        t.isEqual(msg.url, 'https://plot.ly/~node-test-account/0', 'url matches');
        t.notOk(err, 'no error');
        t.end();
    });
});

test('plot with incorrect userdata and return error', function (t) {
    t.plan(1);

    var plotly = require('../index')('node-test-accountasdfadsgaghaha', 'tpmz9ye8hg');
    var data = [{x:[0,1,2], y:[3,2,1], type: 'bar'}];
    var layout = {fileopt : 'overwrite', filename : 'nodenodenodetest'};

    plotly.plot(data, layout, function (err, msg) {

        var errMessage = msg.message.split(',')[0];

        t.isEqual(errMessage, 'Aw', 'incorrect user info returns error... not properly though.');
        t.end();
    });
});

test('makes a rest call with host foo', function (t) {
    t.plan(1);
    var plotly = require('../index')('node-test-account', 'tpmz9ye8hg');
    plotly.host = 'foo';
    var data = [{x:[0,1,2], y:[3,2,1], type: 'bar'}];
    var layout = {fileopt : 'overwrite', filename : 'nodenodenodetest'};

    plotly.plot(data, layout, function (err) {
        t.ok(err, 'error received as host was set to "foo"');
        t.end();
    });
});

test('makes a rest call with no callback', function (t) {
    t.plan(1);
    var plotly = require('../index')('node-test-account', 'tpmz9ye8hg');
    plotly.host = 'foo';
    var data = [{x:[0,1,2], y:[3,2,1], type: 'bar'}];
    var layout = {fileopt : 'overwrite', filename : 'nodenodenodetest'};

    plotly.plot(data, layout);
    t.ok(true);
    t.end();

});

test('makes a rest call with object for data', function (t) {
    t.plan(1);
    var plotly = require('../index')('node-test-account', 'tpmz9ye8hg');
    plotly.host = 'foo';
    var data = {x:[0,1,2], y:[3,2,1], type: 'bar'};
    var layout = {fileopt : 'overwrite', filename : 'nodenodenodetest'};

    plotly.plot(data, layout);
    t.ok(true);
    t.end();

});

test('getFigure', function (t) {
    t.plan(1);
    var plotly = require('../index')('node-test-account', 'tpmz9ye8hg');
    plotly.getFigure('node-test-account', '0', function (err, figure) {
        t.ok(figure);
        t.end();
    });

});

test('getFigure error', function (t) {
    t.plan(1);
    var plotly = require('../index')('node-test-account', 'tpmz9ye8hg');
    plotly.getFigure('node-test-account', '99', function (err) {

        t.ok(err);
        t.end();
    });
});

test('getImage, good and error', function (t) {
    t.plan(2);
    var plotly = require('../index')('node-test-account', 'tpmz9ye8hg');

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

    plotly.getImage(figure, {}, function (err, imageData) {
        t.notOk(err);
        t.ok(imageData);
        t.end();
    });
});

test('getImage, imageserver error', function (t) {
    t.plan(2);
    var plotly = require('../index')('node-test-account', 'tpmz9ye8hg');

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

    var data = [trace1, trace2];
    plotly.getImage(data, 'img', function (err, imageData) {
        t.ok(err);
        t.notOk(imageData);
        t.end();
    });

});

test('creates a plot with UTF chars in filename', function (t) {
	t.plan(1);

    var options = {
        username: 'node-test-account',
        apiKey: 'tpmz9ye8hg',
        host: 'plot.ly',
        port: 443
    };

    var plotly = require('../index')(options);
    var data = [{x:[0,1,2], y:[3,2,1], type: 'bar'}];
    var layout = {fileopt : 'overwrite', filename : 'üüüü'};

    plotly.plot(data, layout, function (err, msg) {
        t.notOk(err ,'no error');
        t.end();
    });

});

test('streams some data', function (t) {
    t.plan(1);
    var plotly = require('../index')('node-test-account', 'tpmz9ye8hg');
    var initdata = [{x:[], y:[], stream:{token:'i9zxn8goas', maxpoints:200}}];
    var initlayout = {fileopt : 'extend', filename : 'nodenodenode-test-stream'};

    plotly.plot(initdata, initlayout, function (err) {
        if (err) return console.log(err);

        var streamObject = JSON.stringify({ x : 1, y : 1 });

        var stream = plotly.stream({
            token: 'i9zxn8goas',
            host: undefined,
            port: null
        });

        setInterval(function () {
            stream.write(streamObject+'\n');
        }, 500);

        setTimeout(function () {
            t.ok(true, 'no errors');
            t.end();
            process.exit(0);
        }, 5000);
    });
});
