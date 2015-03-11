var mongoose = require('mongoose');

exports.connectDb = function() {
    mongoose.connect('mongodb://localhost/test');
};

exports.closeDb = function() {
    mongoose.connection.close();
};

exports.clearData = function(done) {
    for (var i in mongoose.connection.collections) {
        mongoose.connection.collections[i].remove(function() {});
    }
    return done();
};
