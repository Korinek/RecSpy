var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Gym = mongoose.model('Gym');

var remove = function(collection, item) {
    var index = collection.indexOf(item);
    if (index >= 0) {
        collection.splice(index, 1);
    }
};

var sendError = function(res, err) {
    console.log('sending error');
    console.log(err);
    res.status(400);
    res.send({
        reason: err.toString(),
    });
};

var getEmployment = function(userId, gyms) {
    var employment;
    gyms.forEach(function(gym) {
        if (gym.employees.indexOf(userId) >= 0) {
            employment = gym;
        }
    });
    return employment;
};

var isPendingEmployee = function(userId) {
    return function(gym) {
        return gym.pendingEmployees.indexOf(userId) >= 0;
    };
};

var contains = function(collection, item) {
    return collection.indexOf(item) >= 0;
};

var getMemberships = function(userId, gyms) {
    var memberships = [];
    gyms.forEach(function(gym) {
        if (contains(gym.members, userId)) {
            memberships.push(gym);
        }
    });
    return memberships;
};

var getPossibleEmployments = function(memberships, currentEmployment, pendingEmployments) {
    var possibleEmployments = [];
    memberships.forEach(function(gym) {
        if (gym !== currentEmployment && !contains(pendingEmployments, gym)) {
            possibleEmployments.push(gym);
        }
    });
    return possibleEmployments;
};

exports.getEmployment = function(req, res, next) {
    var user = req.user;
    var userId = mongoose.Types.ObjectId(user._id);

    Gym.find({}, function(err, allGyms) {
        if (err) {
            sendError(res, err);
        } else {
            var memberships = getMemberships(userId, allGyms);
            var employment = getEmployment(userId, allGyms);
            var pendingEmployments = allGyms.filter(isPendingEmployee(userId));
            var possibleEmployments = getPossibleEmployments(memberships, employment, pendingEmployments);

            res.send({
                employment: employment,
                pendingEmployments: pendingEmployments,
                possibleEmployments: possibleEmployments
            });
        }
    });
};

exports.deleteEmployment = function(req, res, next) {
    var user = req.user;
    var gymId = req.body.gym._id;
    Gym.findOne({
        _id: gymId
    }, function(err, gym) {
        if (err) {
            sendError(res, err);
        } else {
            var isUserOwner = gym.owner.equals(user._id);
            var isUserEmployee = contains(gym.employees, user._id);
            var isUserPendingEmployee = contains(gym.pendingEmployees, user._id);

            console.log('isUserOwner: ' + isUserOwner);
            console.log('isUserEmployee: ' + isUserEmployee);
            console.log('isUserPendingEmployee: ' + isUserPendingEmployee);

            if (!isUserOwner && !isUserEmployee && !isUserPendingEmployee) {
                res.status(404);
                res.send({
                    reason: 'Only the owner of the gym or the employee themself may remove their employment.'
                });
            }

            console.log(gym);
            console.log(user);
            var employeeToRemove = req.body.employee._id;
            console.log('-employeeToRemove-');
            console.log(employeeToRemove);

            console.log('-currentEmployees-');
            console.log(gym.employees);
            var updatedEmployees = gym.employees;
            remove(updatedEmployees, employeeToRemove);
            console.log('-updatedEmployees-');
            console.log(updatedEmployees);

            console.log('-currentPendingEmployees-');
            console.log(gym.pendingEmployees);
            var updatedPendingEmployees = gym.pendingEmployees;
            remove(updatedPendingEmployees, employeeToRemove);
            console.log('-updatedPendingEmployees-');
            console.log(updatedPendingEmployees);

            Gym.update({
                _id: gym._id
            }, {
                employees: updatedEmployees,
                pendingEmployees: updatedPendingEmployees
            }, function(err) {
                if (err) {
                    sendError(res, err);
                } else {
                    res.send({
                        success: true
                    });
                }
            });
        }
    });
};

exports.requestEmployment = function(req, res, next) {
    var user = req.user;
    var gymId = req.body.gym._id;

    console.log('--requestEmployment--');

    Gym.findOne({
        _id: gymId
    }, function(err, gym) {
        console.log(gym);
        console.log(user);
        var updatedPendingEmployees = gym.pendingEmployees;
        updatedPendingEmployees.push(user);

        console.log('*updatedPendingEmployees');
        console.log(updatedPendingEmployees);

        Gym.update({
            _id: gym._id
        }, {
            pendingEmployees: updatedPendingEmployees
        }, function(err) {
            if (err) {
                sendError(res, err);
            } else {
                res.send({
                    success: true
                });
            }
        });
    });
};

exports.acceptEmployment = function(req, res, next) {
    var user = req.user;
    var gymId = req.body.gym._id;
    Gym.findOne({
        owner: user
    }, function(err, gym) {
        var newEmployee = req.body.pendingEmployee._id;
        console.log('-newEmployee-');
        console.log(newEmployee);

        var updatedEmployees = gym.employees;
        updatedEmployees.push(newEmployee);

        var updatedPendingEmployees = gym.pendingEmployees;
        remove(updatedPendingEmployees, newEmployee);

        console.log('-updatedEmployees-');
        console.log(updatedEmployees);

        console.log('-updatedPendingEmployees-');
        console.log(updatedPendingEmployees);

        Gym.update({
            owner: user
        }, {
            employees: updatedEmployees,
            pendingEmployees: updatedPendingEmployees
        }, function(err) {
            if (err) {
                sendError(res, err);
            } else {
                res.send({
                    success: true
                });
            }
        });
    });
};
