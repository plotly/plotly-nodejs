var plotly = require('./plotly.js')();

var un = 'desired_username';
var email = 'your_email@email.com';

plotly.signup(un, email, function (err, msg) {
	console.log(msg);
});