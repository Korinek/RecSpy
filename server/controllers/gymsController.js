var Gym = require('mongoose').model('Gym');

var contains = function(list, item) {
    return list.indexOf(item) >= 0;
};

var sendError = function(res, err) {
    res.status(400);
    res.send({
        reason: err.toString()
    });

};

function getScrubbedGyms(unscrubbedGyms, currentUser) {
    var scrubbedGyms = [];
    unscrubbedGyms.forEach(function(gym) {
        scrubbedGyms.push({
            _id: gym._id,
            name: gym.name,
            owner: gym.owner,
            isCurrentUserMember: contains(gym.members, currentUser._id),
            isCurrentUserPendingMember: contains(gym.pendingMembers, currentUser._id)
        });
    });

    return scrubbedGyms;
}

exports.getAllGyms = function(req, res, next) {
    var currentUser = req.user;
    Gym.find({}, function(err, gyms) {
        if (err) {
            sendError(res, err);
        } else {
            res.send(getScrubbedGyms(gyms, currentUser));
        }
    });
};
