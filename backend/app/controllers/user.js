var user = {};

var mongoose = require('mongoose'),
	UserModel = mongoose.model('User');

user.index = function(req, res, next) {
	// res.send('Listing users page');
	UserModel.find().exec(function (error, users) {
		res.render('users/list', {
		    title: 'Users list',
		    users: users
		});

		//console.log('users', users);
	});
};

user.edit = function(req, res) {
	var id = req.params.id,
		query = {
			_id: id
		};

	console.log('updating: ' + id);

	if(!id) return renderError(res, 'Not valid id');
	UserModel.find(query).exec(displayUser);

	function displayUser(error, user) {
		if(error) return renderError(res, error);
		return res.render('users/edit', {
			user: user[0]
		});	
	}
};

user.save = function(req, res) {
	var query = {
		_id: req.body._id
	};
	return UserModel.find(query).exec(saveUser);

	function saveUser(error, user) {
		if(error) return renderError(res, error);
		return !user ? newUser() : updateUser();
	}

	function newUser() {
		var newUser = new UserModel(req.body);
		newUser.provider = 'local';
		newUser.save(function(error) {
			if(error) return renderError(res, error);
			res.redirect(req.header('Referer'));
		});
	}

	function updateUser() {
		return UserModel.update(query, { $set: req.body }, {}, function(error, numAffected) {
			if(error) return renderError(res, error);
			res.redirect(req.header('Referer'));
		});
	}

};

module.exports = user;

function renderError(res, error) {
	console.log(error);
	return res.render('common/error', {
		error: error
	})
}