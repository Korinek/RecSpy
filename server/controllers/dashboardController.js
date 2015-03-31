var mongoose = require('mongoose'),
    Gym = mongoose.model('Gym');

exports.getGymStatistics = function(req, res, next) {
    var user = req.user;
    var userId = user._id;

    Gym.find({
        members: userId
    }, function(err, gyms) {
        if (err) {
            res.error(400);
            res.send({
                reason: err.toString()
            });
        }

        console.log(gyms);
        res.send({
            memberships: gyms
        });

    });
};
