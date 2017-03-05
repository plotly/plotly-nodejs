'use strict';

module.exports = function(div, data, layout) {
    div = div || 'notebook-plot';
    data = data || [];
    layout = layout || {};

    return [
        '<div class=\'plotly-plot\'>',
        '<script type=\'text/javascript\' ',
        'src=\'https://cdn.plot.ly/plotly-latest.min.js\'>',
        '</script>',
        '<div id=\'',
        div,
        '\'></div>',
        '<script>Plotly.plot(\'',
        div,
        '\',',
        JSON.stringify(data),
        ',',
        JSON.stringify(layout),
        ');</script>',
        '</div>'
    ].join('');
};
