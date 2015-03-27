var mongoose = require('mongoose'),
    Gym = mongoose.model('Gym');

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

var isMember = function(user) {
    return function(gym) {
        return gym.members.indexOf(user) >= 0;
    };
};

var isPendingMember = function(user) {
    return function(gym) {
        return gym.pendingMembers.indexOf(user) >= 0;
    };
};

exports.getMemberships = function(req, res, next) {
    var user = req.user;
    var userId = mongoose.Types.ObjectId(user._id);

    Gym.find({}, function(err, allGyms) {
        if (err) {
            console.log(err);
            sendError(res, err);
        } else {
            var currentMemberships = allGyms.filter(isMember(userId));
            var pendingMemberships = allGyms.filter(isPendingMember(userId));
            //Todo: scrub this
            res.send({
                currentMemberships: currentMemberships,
                pendingMemberships: pendingMemberships
            });
        }
    });
};

exports.acceptMembership = function(req, res, next) {
    var user = req.user;
    Gym.findOne({
        _id: req.body.gym._id,
        owner: user._id
    }, function(err, gym) {
        if (err) {
            sendError(res, err);
        }

        var newMemberId = req.body.pendingMember._id;
        remove(gym.pendingMembers, newMemberId);
        gym.members.push(newMemberId);
        gym.checkedOutMembers.push(newMemberId);

        Gym.update({
            _id: gym._id
        }, {
            members: gym.members,
            pendingMembers: gym.pendingMembers,
            checkedOutMembers: gym.checkedOutMembers
        }, function(err, numberAffected, rawResponse) {
            if (err) {
                sendError(res, err);
            }
            sendSuccess(res);
        });
    });
};

exports.deleteMembership = function(req, res, next) {
    var user = req.user;
    var userId = user._id;
    Gym.findOne({
        _id: req.body.gym._id,
        $or: [{
            owner: userId
        }, {
            employees: userId
        }, {
            members: userId
        }, {
            pendingMembers: userId
        }]
    }, function(err, gym) {
        if (err) {
            sendError(res, err);
        }
        var memberToRemove = req.body.member._id;
        remove(gym.members, memberToRemove);
        remove(gym.pendingMembers, memberToRemove);
        remove(gym.checkedInMembers, memberToRemove);
        remove(gym.checkedOutMembers, memberToRemove);

        Gym.update({
            _id: gym._id
        }, {
            members: gym.members,
            pendingMembers: gym.pendingMembers,
            checkedInMembers: gym.checkedInMembers,
            checkedOutMembers: gym.checkedOutMembers
        }, function(err, numberAffected, rawResponse) {
            if (err) {
                sendError(res, err);
            }
            sendSuccess(res);
        });
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
        gym.pendingMembers.push(user);

        Gym.update({
            _id: gym._id
        }, {
            pendingMembers: gym.pendingMembers
        }, function(err, numberAffected, rawResponse) {
            if (err) {
                sendError(res, err);
            }
            sendSuccess(res);
        });
    });
};
