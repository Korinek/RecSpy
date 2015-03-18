var Gym = require('mongoose').model('Gym');

exports.getOwnership = function(req, res, next) {
    Gym.findOne({
        owner: req.user
    }, function(err, gym) {
        if (err) {
            res.status(400);
            res.send({
                reason: err.toString()
            });
        } else {
            res.send(gym);
        }
    });
};
