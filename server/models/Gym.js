var mongoose = require('mongoose');

var gymSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address',
        required: true,
        unique: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    employees: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
        required: false,
        unique: false
    },
    members: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
        required: false,
        unique: false
    }
});

module.exports = mongoose.model('Gym', gymSchema);
