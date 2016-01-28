'use strict';

var test = require('tape');
var Plot = require('../notebook');

test('works with no arguments', function(t) {
    t.plan(1);

    var html = Plot(),
        expected = '<div class=\'plotly-plot\'><script type=\'text/javascript\' src=\'https://cdn.plot.ly/plotly-latest.min.js\'></script><div id=\'notebook-plot\'></div><script>Plotly.plot(\'notebook-plot\',[],{});</script></div>';

    t.isEqual(html, expected);
    t.end();
});

test('works with all arguments', function(t) {
    t.plan(1);

    var html = Plot('test', [{ x: [1,2,3], y: [4,5,6] }], { titlefont: { color: 'red' } }),
        expected = '<div class=\'plotly-plot\'><script type=\'text/javascript\' src=\'https://cdn.plot.ly/plotly-latest.min.js\'></script><div id=\'test\'></div><script>Plotly.plot(\'test\',[{"x":[1,2,3],"y":[4,5,6]}],{"titlefont":{"color":"red"}});</script></div>';

    t.isEqual(html, expected);
    t.end();
});
