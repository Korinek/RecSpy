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
    /*sessions: [{
        userId: mongoose.Schema.Types.ObjectId,
        checkIn: Date,
        checkOut: Date
    }],*/
    sessions: {
        type: Array
    },
    maxCapacity: {
        type: Number,
        required: true,
        min: 0
    },
    openTime: {
        type: Date,
        required: true
    },
    closeTime: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('Gym', gymSchema);
