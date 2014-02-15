##A simple node.js wrapper for the Plotly API.

###Installation

    npm install plotly

###Usage

    var plotly = require('plotly');

###There are two main functions, all arguments are required.

    plotly.signup('desired_username', 'your@email.com')
    plotly.plot(data, username_or_email, api_key, kwargs)`