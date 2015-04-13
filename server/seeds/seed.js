var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Gym = mongoose.model('Gym'),
    encrypt = require('../utilities/encryption');

function seedUsers() {
    for (var i = 1; i <= 100; i++) {
        var userData = {
            firstName: 'User',
            lastName: i,
            username: 'user' + i,
            salt: encrypt.createSalt(),
            password: 'password'
        };

        userData.hashedPassword = encrypt.hashPassword(userData.salt, userData.password);
        User.create(userData);
    }
}

function seedGyms() {
    for (var i = 1; i <= 10; i++) {
        User.findOne({
            username: 'user' + i
        }, function(err, user) {
            var gymData = {
                name: user.firstName + user.lastName + '\'s Gym',
                owner: user,
                maxCapacity: 100
            };

            Gym.create(gymData);
        });
    }
}

function seedMembers() {
    for (var i = 11; i <= 100; i++) {
        User.findOne({
            username: 'user' + i
        }, function(err, user) {
            for (var j = 1; j <= 10; j++) {

                Gym.findOneAndUpdate({
                    name: 'User' + j + '\'s Gym'
                }, {
                    $push: {
                        pendingMembers: user._id
                    }
                }, function(err) {});
            }
        });
    }
}

function seedEmployees() {}

function seedSessions() {}

module.exports = function() {
    console.log('--SEEDING DATA--');
    seedUsers();
    seedGyms();
    seedMembers();
    seedEmployees();
};
