var express = require('express'),
	app = express();

module.exports = Server;

function Server() {
	this.init();
	this.router();
}

Server.prototype.init = function() {
	var server = app.listen(7001, function() {
	    console.info('Listening on port %d', server.address().port);
	});
}

Server.prototype.router = function() {
	var routes = require('./routes')(app);
	app.use(express.static(__dirname + '/public'));
};