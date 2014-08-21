// module.exports = getRoutes;

// var User = require('./models/user');
// var user = new User({
// 	name: 'Lubert Palacios'
// });

// function getRoutes(app) {
// 	app.get('/', function(req, res) {
// 		res.send('PT Rest API v0.1');	
// 	});

// 	app.get('/users', function(req, res) {
// 		res.send('Getting user: ' + user.getName());
// 	});
// }

var async = require('async')

/**
 * Controllers
 */
var landing = require('./controllers/landing');	


/**
 * Expose routes
 */
module.exports = function (app, passport) {
	// Home route
	app.get('/', landing.index);
};