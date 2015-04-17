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

var curDate = new Date(Date.now());
var calculateBestTime = function(sessions) {
    curDate = new Date(curDate.getTime() + 60000); //add one minute each call
    return curDate;
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

        res.send({
            memberships: memberships
        });
    });
};

exports.getBestGymTimes = function(req, res, next) {
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

        var bestGymTimes = [];

        gyms.forEach(function(gym) {
            bestGymTimes.push({
                gymId: gym._id,
                bestGymTime: calculateBestTime(gym.sessions)
            });
        });
        console.log('--sending best times--');
        console.log(bestGymTimes);
        console.log('----------------------');

        res.send({
            bestGymTimes: bestGymTimes
        });
    });
};
