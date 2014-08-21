var 
    express    = require('express'),
    mongoStore = require('connect-mongo')(express),
    helpers    = require('view-helpers'),
    pkg        = require('../package.json'),
    env        = process.env.NODE_ENV || 'dev';

module.exports = config;

function config(app, config, passport) {
    app.set('showStackError', true);

    // Should be placed before express.static
    app.use(express.compress({
        filter: function (req, res) {
            return /json|text|javascript|css/.test(res.getHeader('Content-Type'));
        },
        level: 9
    }));

    app.use(express.favicon());
    app.use(express.static(config.root + '/public'));

    // Set views path, template engine and default layout
    app.set('views', config.root + '/api/views')
    app.set('view engine', 'jade')

    app.configure(function () {
        // Expose package.json to views
        app.use(function (req, res, next) {
            res.locals.pkg = pkg;
            next();
        });

        // CookieParser should be above session
        app.use(express.cookieParser());

        // BodyParser should be above methodOverride
        app.use(express.bodyParser());
        app.use(express.methodOverride());

        // Express/Mongo session storage
        app.use(express.session({
            secret: pkg.name,
            store: new mongoStore({
                url: config.db,
                collection : 'sessions'
            })
        }));

        // Passport session
        app.use(passport.initialize());
        app.use(passport.session());

        // Should be declared after session and flash
        app.use(helpers(pkg.name));

        // adds CSRF support
        if (process.env.NODE_ENV !== 'test') {
            app.use(express.csrf());

            // This could be moved to view-helpers
            app.use(function(req, res, next){
                res.locals.csrf_token = req.csrfToken();
                next();
            });
        }

        // Routes should be at the last
        app.use(app.router);

        // assume "not found" in the error msgs
        // is a 404. this is somewhat silly, but
        // valid, you can do whatever you like, set
        // properties, use instanceof etc.
        app.use(function(err, req, res, next){
            // Treat as 404

            if (err.message) {
                var isErr =  ~err.message.indexOf('not found') || ~err.message.indexOf('Cast to ObjectId failed');
                if(isErr) return next();
            }

            // Log it
            // send emails if you want
            console.error(err.stack);

            // Error page
            res.status(500).render('500', { error: err.stack });
        });

        // Assume 404 since no middleware responded
        app.use(function(req, res, next){
            res.status(404).render('404', {
                url: req.originalUrl,
                error: 'Not found'
            });
        });
    })

    // development env config
    app.configure('development', function () {
        app.locals.pretty = true;
    });
}