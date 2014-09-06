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
var landingCtrl = require('./controllers/landing');
var userCtrl = require('./controllers/user');


/**
 * Expose routes
 */
module.exports = function (app, passport) {
	// Home route
	app.get('/', landingCtrl.index);

	app.get('/user', userCtrl.index);
	app.get('/user/new', userCtrl.create);
};