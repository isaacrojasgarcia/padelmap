var landing = {};

landing.index = function(req, res) {
	console.log('Index page');
	res.send('Index page');
};

module.exports = landing;