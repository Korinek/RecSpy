var mongoose = require('mongoose');

module.exports = function (config) {
    console.log('attempting to connect to ' + config.db);
    mongoose.connect(config.db);
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error...'));
    db.once('open', function callback() {
        console.log('recspy db opened');
    });
};
