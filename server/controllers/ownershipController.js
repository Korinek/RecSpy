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

exports.createOwnership = function(req, res, next) {
    var gymData = req.body;
    gymData.owner = req.user;
    gymData.name = gymData.gymName;
    Gym.create(gymData, function(err, gym) {
        if (err) {
            console.log(err);
            if (err.toString().indexOf('E11000') > -1) {
                err = new Error('Duplicate Gym Name');
            }

            res.status(400);
            return res.send({
                reason: err.toString()
            });
        }
        console.log('Created Gym');
        console.log(gym);
        console.log('----');
        res.send(gym);
    });
};
