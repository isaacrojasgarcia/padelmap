var mongoose = require('mongoose'),
	Schema   = mongoose.Schema,
	crypto   = require('crypto');

var userSchema = new Schema({
	name: { type: String, default: '' },
	email: { type: String, default: '' },
	username: { type: String, default: '' },
	hashedPassword: { type: String, default: '' },
	salt: { type: String, default: '' }
});

userSchema
	.virtual('password')
	.set(setPassword)
	.get(getPassword);

userSchema.methods = {
	encryptPassword: encryptPassword,

	authenticate: function(planTextPassword) {
		return this.encryptPassword(planTextPassword) === this.hashedPassword;
	},

	makeSalt: function() {
		return Math.round(new Date().valueOf() * Math.random()) + '';
	},

	doesNotRequireValidation: function() {
		return ~oAuthTypes.indexOf(this.provider);
	}
};

mongoose.model('User', userSchema);

function setPassword(password) {
	this._password = password;
	this.salt = this.makeSalt();
	this.hashedPassword = this.encryptPassword(password);
}

function getPassword() {
	return this._password;
}

function encryptPassword(password) {
	if(!password) return '';
	try {
		return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
	}
	catch (err) {
		return '';
	}
}