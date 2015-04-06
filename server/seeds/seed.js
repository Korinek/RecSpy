var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Gym = mongoose.model('Gym'),
    encrypt = require('../utilities/encryption');

function seedUsers() {
    for(var i = 1; i <= 100; i++) {
        var userData = {
            firstName: 'User',
            lastName: i,
            username: 'user'+i,
            salt: encrypt.createSalt(),
            password: 'password'
        };

        userData.hashedPassword = encrypt.hashPassword(userData.salt, userData.password);
        User.create(userData);
    }
}

function seedGyms() {
}

function seedMembers() {
}

function seedEmployees() {
}

module.exports = function() {
    console.log('--SEEDING DATA--');
    seedUsers();
    seedGyms();
    seedMembers();
    seedEmployees();
};
