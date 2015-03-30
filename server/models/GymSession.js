var mongoose = require('mongoose');

var gymSessionSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: false
    },
    checkIn: {
        type: Date,
        required: true,
        unique: false
    },
    checkOut: {
        type: Date,
        required: false,
        required: false
    }
});

module.exports = mongoose.model('GymSession', gymSession);
