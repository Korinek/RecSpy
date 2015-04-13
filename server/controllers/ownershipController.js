var mongoose = require('mongoose'),
    Gym = mongoose.model('Gym'),
    User = mongoose.model('User'),
    async = require('async');

var getRealName = function(userId, newUserList, next) {
    User.findOne({
        _id: userId
    }, function(err, user) {

        newUserList.push({
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName
        });
        next();
    });
};

var convertUserIdListToNames = function(userIdList, next) {
    var newUserList = [];
    async.each(userIdList, function(userid, callback) {
        getRealName(userid, newUserList, callback);
    }, function(err) {
        next(newUserList);
    });
};

exports.getOwnership = function(req, res, next) {
    Gym.findOne({
        owner: req.user
    }, function(err, gym) {
        if (err) {
            res.status(400);
            res.send({
                reason: err.toString()
            });
        }

        if (!gym) {
            res.send(gym);
            return;
        }

        var scrubbedGym = {
            _id: gym._id,
            name: gym.name,
            owner: gym.owner
        };

        //This needs refactored so bad, lol.
        convertUserIdListToNames(gym.employees, function(employees) {
            scrubbedGym.employees = employees;

            convertUserIdListToNames(gym.members, function(members) {
                scrubbedGym.members = members;

                convertUserIdListToNames(gym.pendingMembers, function(pendingMembers) {
                    scrubbedGym.pendingMembers = pendingMembers;

                    convertUserIdListToNames(gym.pendingEmployees, function(pendingEmployees) {
                        scrubbedGym.pendingEmployees = pendingEmployees;

                        console.log(scrubbedGym);
                        res.send(scrubbedGym);
                    });
                });
            });
        });
    });
};

exports.createOwnership = function(req, res, next) {
    var gymData = req.body;
    gymData.owner = req.user;
    gymData.name = gymData.gymName;
    Gym.create(gymData, function(err, gym) {
        if (err) {
            console.log(err);
            if (err.toString().indexOf('E11000') > -1) {
                err = new Error('Duplicate Gym Name');
            }

            res.status(400);
            return res.send({
                reason: err.toString()
            });
        }
        res.send(gym);
    });
};
