var express = require('express'),
	params = require('express-params')
	app = express();

params.extend(app);
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
	console.log(__dirname + '/../dist/');
	app.use(express.static(__dirname + '/../dist/'));
};