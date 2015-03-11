var User = require('mongoose').model('User'),
    encrypt = require('../utilities/encryption');

exports.createUser = function(req, res, next) {
    var userData = req.body;
    userData.username = userData.username.toLowerCase();
    userData.salt = encrypt.createSalt();
    userData.hashedPassword = encrypt.hashPassword(userData.salt, userData.password);

    User.create(userData, function(err, user) {
        if (err) {
            console.log(err);
            if (err.toString().indexOf('E11000') > -1) {
                err = new Error('Duplicate Username');
            }
            res.status(400);
            return res.send({
                reason: err.toString()
            });
        }
        req.logIn(user, function(err) {
            if (err) {
                return next(err);
            }
            res.send(user);
        });
    });
};
