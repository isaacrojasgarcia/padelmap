var mongoose         = require('mongoose'),
    LocalStrategy    = require('passport-local').Strategy,
    FacebookStrategy = require('passport-facebook').Strategy,
    User             = mongoose.model('User');


module.exports = configFx;

function configFx(passport, config) {
    // Serialize sessions
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findOne({ 
            _id: id 
        }, function (err, user) {
            done(err, user);
        });
    });

    // Local Strategy
    var userData = {
        usernameField: 'email',
        passwordField: 'password'
    };

    passport.use(new LocalStrategy(userData, cbLocalStrategy));
    
    function cbLocalStrategy(email, password, done) {
        User.findOne({ 
            email: email 
        }, function (err, user) {
            if (err) return done(err);
            if (!user) {
                return done(null, false, { message: 'Unknown user' });
            }
            if (!user.authenticate(password)) {
                return done(null, false, { message: 'Invalid password' });
            }
            return done(null, user);
        });
    }

    // Facebook Strategy
    var facebookUserData = {
        clientID: config.facebook.clientID,
        clientSecret: config.facebook.clientSecret,
        callbackURL: config.facebook.callbackURL
    };

    passport.use(new FacebookStrategy(facebookUserData, cbFacebookStrategy));

    function cbFacebookStrategy(accessToken, refreshToken, profile, done) {
        User.findOne({ 
            'facebook.id': profile.id 
        }, function (err, user) {
            if (err) return done(err);
            if (!user) {
                user = new User({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    username: profile.username,
                    provider: 'facebook',
                    facebook: profile._json
                });
                user.save(function (err) {
                    if (err) console.log(err);
                    return done(err, user);
                });
            }
            else {
                return done(err, user);
            }
        });
    }
}