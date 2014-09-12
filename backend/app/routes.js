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
	app.get('/user/new', userCtrl.edit);
	app.post('/user/save', userCtrl.save);
	app.get('/user/:id', userCtrl.edit);

};