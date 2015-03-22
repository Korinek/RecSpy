var Gym = require('mongoose').model('Gym');

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
    res.send('accept membership response');
};

exports.deleteMembership = function(req, res, next) {
    var user = req.user;
    Gym.findOne({
        _id: req.body.gym._id
    }, function(err, gym) {
        if (err) {
            sendError(res, err);
        }

        if (user._id != req.body.member._id && user._id != gym.owner) {
            res.status(403);
            res.send({
                reason: 'Only the owner/employee of the gym or the user themself my remove a membership.'
            });

        } else {

            var indexOfMember = gym.members.indexOf(user._id);
            if (indexOfMember >= 0) {

                var updatedMembers = gym.members;
                updatedMembers.splice(indexOfMember, 1);
                Gym.update(gym, {
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
                        name: gym.name
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
