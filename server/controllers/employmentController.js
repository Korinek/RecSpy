exports.getEmployment = function(req, res, next) {
    res.send('/api/employment success!');
};

exports.deleteEmployment = function(req, res, next) {
    res.send('delete employment response');
};

exports.requestEmployment = function(req, res, next) {
    res.send('request employment response');
};

exports.acceptEmployment = function(req, res, next) {
    res.send('accept employment response');
};
