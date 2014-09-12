var landing = {};

landing.index = function(req, res) {
	res.render('common/index', {});
};

module.exports = landing;