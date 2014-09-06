var user = {};

var mongoose = require('mongoose'),
	UserModel = mongoose.model('User');

user.index = function(req, res) {
	res.send('Listing users page');
};

user.create = function(req, res) {
	var user = new UserModel({
		name: 'Lubert Palacios'
	});

	user.provider = 'local'
	user.save(function (err) {
		if (err) {
			res.send('Error creating user ');
			console.log(err);
		}
	});

	//res.send('User created');
}

module.exports = user;