var mongoose = require('mongoose'),
    encrypt = require('../utilities/encryption');

var pathIsRequiredText = '{PATH} is required!';

var userSchema = mongoose.Schema({
    firstName: {type: String, required: pathIsRequiredText},
    lastName: {type: String, required: pathIsRequiredText},
    username: {type: String, required: pathIsRequiredText, unique: true},
    salt: {type: String, required: pathIsRequiredText},
    hashedPassword: {type: String, required: pathIsRequiredText}
});

userSchema.methods.authenticate = function (passwordToMatch) {
    return encrypt.hashPassword(this.salt, passwordToMatch) === this.hashedPassword;
};


module.exports = mongoose.model('User', userSchema);

/*function createDefaultUser() {
 User.find({}).exec(function (err, collection) {
 if (collection.length === 0) {
 var salt, hash;
 salt = encrypt.createSalt();
 hash = encrypt.hashPassword(salt, 'password');
 User.create(
 {
 firstName: 'Haddon',
 lastName: 'Korinek',
 username: 'admin',
 salt: salt,
 hashedPassword: hash
 }, function (err) {
 if (err) throw err;
 });
 }
 });
 };

 exports.createDefaultUsers = createDefaultUser;*/