var mongoose = require('mongoose');

var gymSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
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
    pendingEmployees: {
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
    },
    pendingMembers: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
        required: false,
        unique: false
    },
    checkedInMembers: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
        required: false,
        unique: false
    },
    checkedOutMembers: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
        required: false,
        unique: false
    },
    sessions: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'GymSession',
        required: false,
        unique: false
    }
});

module.exports = mongoose.model('Gym', gymSchema);
