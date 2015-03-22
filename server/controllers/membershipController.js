var Gym = require('mongoose').model('Gym');

var contains = function(list, item) {
    return list.indexOf(item) > 0;
};

var remove = function(list, item) {
    var index = list.indexOf(item);
    if (index >= 0) {
        list.splice(index, 1);
    }
};

var sendSuccess = function(res) {
    console.log('sending success');
    res.send({
        succcess: true
    });
};

var sendFailure = function(res) {
    console.log('sending failure');
    res.send({
        success: false,
    });
};

var sendError = function(res, err) {
    console.log('sending error');
    res.status(400);
    res.send({
        reason: err.toString(),
    });
};

exports.getMemberships = function(req, res, next) {
    res.send('get memberships response');
};

exports.acceptMembership = function(req, res, next) {
    var user = req.user;
    Gym.findOne({
        _id: req.body.gym._id
    }, function(err, gym) {
        if (err) {
            sendError(res, err);
        }

        console.log('--req.body--');
        console.log(req.body);
        console.log('------------');

        console.log(gym);

        var newMember = req.body.pendingMember._id;

        if (contains(gym.employees, user) || gym.owner.equals(user._id)) {
            var updatedMembers = gym.members;
            updatedMembers.push(newMember);

            var updatedPendingMembers = gym.pendingMembers;
            remove(updatedPendingMembers, newMember);

            console.log('--updatedMembers--');
            console.log(updatedMembers);
            console.log('------------------');
            console.log('--updatedPendingMembers--');
            console.log(updatedPendingMembers);
            console.log('-------------------------');

            Gym.update({
                _id: gym._id
            }, {
                members: updatedMembers,
                pendingMembers: updatedPendingMembers
            }, function(err, numberAffected, rawResponse) {
                if (err) {
                    sendError(res, err);
                }
                sendSuccess(res);
            });

        } else {
            console.log('acceptMembership permission denied');
            res.status(403);
            res.send({
                reason: 'Only an employee or owner of the gym may accept a membership request.'
            });
        }
    });
};

exports.deleteMembership = function(req, res, next) {
    var user = req.user;
    Gym.findOne({
        _id: req.body.gym._id
    }, function(err, gym) {
        if (err) {
            sendError(res, err);
        }

        if (user._id !== req.body.member._id && !gym.owner.equals(user._id) && !contains(gym.employees, user._id)) {
            res.status(403);
            res.send({
                reason: 'Only the owner/employee of the gym or the user themself my remove a membership.'
            });

        } else {

            var indexOfMember = gym.members.indexOf(user._id);
            if (indexOfMember >= 0) {

                var updatedMembers = gym.members;
                updatedMembers.splice(indexOfMember, 1);
                console.log('--updatedMembers--');
                console.log(updatedMembers);
                console.log('------------------');

                Gym.update({
                    _id: gym._id
                }, {
                    members: updatedMembers
                }, function(err, numberAffected, rawResponse) {
                    if (err) {
                        sendError(res, err);
                    }
                    sendSuccess(res);
                });
            } else {

                var indexOfPendingMember = gym.pendingMembers.indexOf(user._id);
                if (indexOfPendingMember >= 0) {
                    var updatedPendingMembers = gym.pendingMembers;
                    updatedPendingMembers.splice(indexOfPendingMember, 1);

                    Gym.update({
                        _id: gym._id
                    }, {
                        pendingMembers: updatedPendingMembers
                    }, function(err, numberAffected, rawResponse) {
                        if (err) {
                            sendError(res, err);
                        }
                        sendSuccess(res);
                    });
                } else {
                    sendFailure(res);
                }
            }
        }
    });
};

exports.requestMembership = function(req, res, next) {
    var user = req.user;
    var gym = req.body.gym;
    Gym.findOne({
        name: gym.name
    }, function(err, gym) {
        if (err) {
            sendFailure(res);
        }
        var pendingMembers = gym.pendingMembers;
        pendingMembers.push(user);

        Gym.update({
            name: gym.name
        }, {
            pendingMembers: pendingMembers
        }, function(err, numberAffected, rawResponse) {
            if (err) {
                sendError(res, err);
            }
            sendSuccess(res);
        });
    });
};
