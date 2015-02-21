var mongoose = require('mongoose'),
    encrypt = require('../utilities/encryption');

var userSchema = mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    username: {type: String, required: true, unique: true},
    salt: {type: String, required: true},
    hashedPassword: {type: String, required: true}
});

userSchema.methods.authenticate = function (passwordToMatch) {
    return encrypt.hashPassword(this.salt, passwordToMatch) === this.hashedPassword;
};

module.exports = mongoose.model('User', userSchema);