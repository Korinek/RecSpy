var Gym = require('mongoose').model('Gym');

function getScrubbedGyms (unscrubbedGyms) {
    var scrubbedGyms = [];
    unscrubbedGyms.forEach(function(gym) {
        scrubbedGyms.push({
            name: gym.name
        });
    });

    return scrubbedGyms;
};

exports.getAllGyms = function(req, res, next) {
    Gym.find({}, function(err, gyms) {
        if (err) {
            res.status(400);
            res.send({
                reason: err.toString()
            });
        } else {
            res.send(getScrubbedGyms(gyms));
        }
    });
};
