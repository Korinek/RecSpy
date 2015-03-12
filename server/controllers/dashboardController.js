exports.getGymStatistics = function(req, res, next) {
    console.log('Gym Statistics Req');
    console.log(req.headers.cookie);
    res.send('Made It Into Gym Statistics');
};
