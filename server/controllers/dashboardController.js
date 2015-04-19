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

var timeToDouble = function(time) {
    return time.getHours() + time.getMinutes() / 100;
};

var getActiveSessions = function(sessions, time) {
    var startInterval = timeToDouble(time);
    var endInterval = time;
    endInterval.setMinutes(endInterval.getMinutes() + 5);
    endInterval = timeToDouble(endInterval);

    var payload = [];
    sessions.forEach(function(session) {
        var checkIn = timeToDouble(session.checkIn);
        var checkOut = timeToDouble(session.checkOut);
        if (checkIn < startInterval && checkOut > endInterval) {
            payload.push(session);
        }
    });

    console.log('--activeSessions between--' + startInterval + ' and ' + endInterval);
    console.log(payload.length);
    console.log('------------------');

    return payload;
};

var calculateBestTime = function(gym) {
    var sessions = gym.sessions;
    var gymOpen = timeToDouble(new Date(gym.openTime));
    var gymClose = timeToDouble(new Date(gym.closeTime));

    var now = new Date();
    var currentDay = now.getDay();
    var sessionsToConsider = [];

    sessions.forEach(function(session) {
        var sessionDate = new Date(session.checkIn);

        var isPastCurrentTime = timeToDouble(sessionDate) > timeToDouble(now);
        var isPastOpen = timeToDouble(sessionDate) > gymOpen;
        var isBeforeClose = timeToDouble(sessionDate) < gymClose;
        var isOnCurrentDay = sessionDate.getDay() === currentDay;
        /*console.log('---session check---');
        console.log('isPastCurrentTime = ' + isPastCurrentTime);
        console.log('isPastOpen = ' + isPastOpen);
        console.log('isBeforeCLose = ' + isBeforeClose);
        console.log('isOnCurrentDay = ' + isOnCurrentDay);
        console.log('------------------------');*/

        if (isOnCurrentDay && isPastOpen && isPastCurrentTime && isBeforeClose) {
            // only consider times from now until one hour before closing time
            sessionsToConsider.push(session);
        }
    });

    //if the gym is closed, return bogus value
    if (timeToDouble(now) > gymClose) {
        return now;
    }
    // iterate over the dates to consider
    // look in 5 minute increments and see how many people were checked in
    // the time with the least amount of people should get returned
    var bestTime = new Date(now);
    var bestCount = 10000;

    console.log('---sessionsToConsider---');
    console.log(sessionsToConsider);
    console.log('----------' + sessionsToConsider.length + '--------------');

    while (timeToDouble(now) < gymClose) {
        var activeSessions = getActiveSessions(sessionsToConsider, now);
        if (activeSessions.length < bestCount) {
            bestCount = activeSessions.length;
            bestTime = now;
        }

        now.setMinutes(now.getMinutes() + 5);
    }

    return now;
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
                bestGymTime: calculateBestTime(gym)
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
