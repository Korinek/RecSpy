var mongoose = require('mongoose');

var gymSchema = mongoose.Schema({
    name: {type: String, required: true},
    address: {type: mongoose.Schema.Types.ObjectId, ref:'Address', required: true, unique: true}
});

module.exports = mongoose.model('Gym', gymSchema);