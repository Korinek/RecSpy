var mongoose = require('mongoose'),
    Gym = mongoose.model('Gym');

var getGymPopulationPercentage = function(gym) {
    return (parseFloat(gym.checkedInMembers.length) / gym.maxCapacity) * 100;
};

var setGymPopulationPercentages = function(gyms) {
    gyms.forEach(function(gym) {
        var percentage = getGymPopulationPercentage(gym);
        gym.currentPopulationPercentage = percentage;
    });
};

exports.getGymStatistics = function(req, res, next) {
    var user = req.user;
    var userId = user._id;

    Gym.find({
        members: userId
    }).lean().exec(function(err, gyms) {
        if (err) {
            res.error(400);
            res.send({
                reason: err.toString()
            });
        }
        var memberships = gyms;
        setGymPopulationPercentages(memberships);

        console.log(memberships);
        res.send({
            memberships: memberships
        });
    });
};
