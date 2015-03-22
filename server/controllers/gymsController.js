var Gym = require('mongoose').model('Gym');

var contains = function(list, item) {
    return list.indexOf(item) >= 0;
};

function getScrubbedGyms(unscrubbedGyms, currentUser) {
    var scrubbedGyms = [];
    unscrubbedGyms.forEach(function(gym) {
        scrubbedGyms.push({
            name: gym.name,
            isCurrentUserMember: contains(gym.members, currentUser._id),
            isCurrentUserPendingMember: contains(gym.pendingMembers, currentUser._id)
        });
    });

    return scrubbedGyms;
}

exports.getAllGyms = function(req, res, next) {
    console.log('--getAlLGyms--');
    console.log(req.user);
    console.log('--------------');
    var currentUser = req.user;
    Gym.find({}, function(err, gyms) {
        console.log(gyms);
        if (err) {
            res.status(400);
            res.send({
                reason: err.toString()
            });
        } else {
            res.send(getScrubbedGyms(gyms, currentUser));
        }
    });
};
