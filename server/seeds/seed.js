var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Gym = mongoose.model('Gym'),
    encrypt = require('../utilities/encryption');

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes * 60000);
}

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
    var openTime = new Date();
    openTime.setHours(7);

    var closeTime = new Date();
    closeTime.setHours(22);
    
    for (var i = 1; i <= 10; i++) {
        User.findOne({
            username: 'user' + i
        }, function(err, user) {
            if (err) {
                console.log(err);
            }

            var gymData = {
                name: user.firstName + user.lastName + '\'s Gym',
                owner: user,
                maxCapacity: 100,
                openTime: openTime,
                closeTime: closeTime
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

function seedSessions() {
    User.findOne({
        firstName: 'Haddon'
    }, function(err, user) {
        var gymSessions = [];

        var startHours = 7;
        var endHours = 23;

        for (var i = 0; i < 1000; i++) {
            //var randomDay = getRandomInt(0, 90); //last three months
            var randomDay = 7;
            var randomStartHour = getRandomInt(startHours, endHours);
            var randomStartMinutes = getRandomInt(0, 60);
            var startDateTime = new Date(new Date().setDate(new Date().getDate() - randomDay));
            startDateTime.setHours(randomStartHour);
            startDateTime.setMinutes(randomStartMinutes);

            var sessionLengthMinutes = getRandomInt(15, 90);
            var endDateTime = new Date(startDateTime);
            endDateTime.setMinutes(startDateTime.getMinutes() + sessionLengthMinutes);

            var session = {
                checkIn: startDateTime,
                checkOut: endDateTime,
                userId: user._id
            };
            /*if (session.checkIn.toDateString() === new Date().toDateString()) {
                console.log(session.checkIn);
            }*/
            gymSessions.push(session);
        }

        Gym.findOneAndUpdate({
            name: 'Haddon\'s Gym'
        }, {
            sessions: gymSessions
        }, function(err) {});
    });
}

module.exports = function() {
    console.log('--SEEDING DATA--');
    seedUsers();
    seedGyms();
    seedMembers();
    seedEmployees();
    seedSessions();
};
