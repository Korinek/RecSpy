var mongoose = require('mongoose'),
    expect = require('chai').expect;
User = require('../../../server/models/User');

mongoose.connect('mongodb://localhost/test');

describe('User', function () {

    var createDefaultUser = function (done) {
        User.create(
            {
                firstName: 'fooFirstName',
                lastName: 'fooLastName',
                username: 'fooUsername',
                salt: 'MXV9bhEJdQTcvApBavRp12+oFbofvC02jgTYbTgzhtlgLcx8ZeuH+I8+zCui25GZ37zKUtObcfoZ9XJ+eulR1h9t30rZMg7tvQIy2x9GJpU5DaPZaUoWu7YTt/IZQlWcmBKIbF05ydQG4iVd7c5rngqiHo5hlv8K5guTFvl9C3k=',
                //regular password is fooPassword
                hashedPassword: '4bc39a9186bfb5ed618d75f1d9b791012a5fb4f7'
            }, function (err) {
                if (err) throw err;
                done();
            });
    };

    var getProperty = function (propertyName) {
        return User.schema.path(propertyName);
    };

    var isPropertyRequired = function (propertyName) {
        return getProperty(propertyName).isRequired;
    };

    beforeEach(function (done) {
        createDefaultUser(done);
    });

    afterEach(function (done) {
        User.remove({}, function () {
            done();
        });
    });

    it('should create the user', function (done) {
        User.findOne({firstName: 'fooFirstName'}, function (err, user) {
            expect(user).to.exist;
            done();
        });
    });

    describe('Authentication', function () {
        it('should authenticate when passwords match', function (done) {
            User.findOne({firstName: 'fooFirstName'}).exec(function (err, user) {
                expect(user.authenticate('fooPassword')).to.be.true;
                done();
            });
        });

        it('should not authenticate when passwords do not match', function (done) {
            User.findOne({firstName: 'fooFirstName'}).exec(function (err, user) {
                expect(user.authenticate('wrongPassword')).to.be.false;
                done();
            });
        });
    });

    describe('Property Attributes', function () {
        it('should make username unique', function () {
            expect(getProperty('username')._index.unique).to.be.true;
        });

        it('should require a first name', function () {
            expect(isPropertyRequired('firstName')).to.be.true;
        });

        it('should require a last name', function () {
            expect(isPropertyRequired('lastName')).to.be.true;
        });

        it('should require a username', function () {
            expect(isPropertyRequired('username')).to.be.true;
        });

        it('should require a salt', function () {
            expect(isPropertyRequired('salt')).to.be.true;
        });

        it('should require a hashed password', function () {
            expect(isPropertyRequired('hashedPassword')).to.be.true;
        });
    });
});