var passport = require('passport');

exports.authenticate = function(req, res, next) {
    req.body.username = req.body.username.toLowerCase();
    var auth = passport.authenticate('local', function(err, user) {
        console.log('Authenticating against ');
        console.log(user);
        if (err) {
            console.log('Auth error');
            return next(err);
        }
        if (!user) {
            console.log('User was null');
            res.send({
                success: false
            });
        }
        console.log('logging in user');
        req.logIn(user, function(err) {
            if (err) {
                console.log('error logging in');
                return next(err);
            }
            console.log('login was successful');
            res.send({
                success: true,
                user: user
            });
        });
    });
    auth(req, res, next);
};

exports.requiresApiLogin = function(req, res, next) {
    console.log('Requires Api Login');
    console.log(req.user);
    console.log(req.cookie);
    console.log('End Requires Api Login');
    if (!req.isAuthenticated()) {
        res.status(403);
        res.end();
    } else {
        next();
    }
};
