'use strict';

var mongoose = require('mongoose');

var addressSchema = mongoose.Schema({
    country: {type: String, required: true},
    stateRegionOrProvince: {type: String, required: true},
    zip: {type: Number, required: true},
    city: {type: String, required: true},
    streetAddress: {type: String, required: true},
    phoneNumber: {type: Number, required: false}
});

module.exports = mongoose.model('Address', addressSchema);