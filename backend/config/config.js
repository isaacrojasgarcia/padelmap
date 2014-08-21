var path = require('path'), 
	rootPath = path.normalize(__dirname + '/..');

module.exports = {
	dev: {
		db: 'mongodb://localhost/padelwar',
		root: rootPath,
		app: {
			name: 'War app powered by trepafi'
		},
		facebook: {
			clientID: "APP_ID",
			clientSecret: "APP_SECRET",
			callbackURL: "http://localhost:3000/auth/facebook/callback"
		}
	}
};