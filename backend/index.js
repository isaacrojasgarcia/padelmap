var 
	express  = require('express'),
	fs       = require('fs'),
	passport = require('passport');

var env      = process.env.NODE_ENV || 'dev',
	config   = require('./config/config')[env],
	mongoose = require('mongoose');

// Database connection
(function connect() {
	var options = { 
		server: { 
			socketOptions: { 
				keepAlive: 1 
			} 
		} 
	};

	mongoose.connect(config.db, options);

	// Error handler
	mongoose.connection.on('error', function (err) {
		console.log(err);
	});

	// Reconnect when closed
	mongoose.connection.on('disconnected', function () {
		connect();
	});
})();


// Bootstraping models
var modelsPath = __dirname + '/api/models';
fs.readdirSync(modelsPath)
	.forEach(function(file) {
		console.log('registering model: ', file);
		if( ~file.indexOf('.js') ) {
			require(modelsPath + '/' + file);	
		} 
	});


// Passport bootstrap config
require('./config/passport')(passport, config);


// Express config
var app = express();
require('./config/express')(app, config, passport);


// Bootstraping routes
require('./api/routes')(app, passport);


// Start the app by listening on <port>
var port = process.env.PORT || 7001;
app.listen(port);
console.log('Express app started on port ' + port);


// Expose app
exports = module.exports = app;