var expect = require('chai').expect,
    User = require('../../../server/models/User'),
    usersController = require('../../../server/controllers/usersController');

describe('Users Controller', function() {

    describe('Create User', function() {
        describe('Duplicate User', function() {
            it('should return 400', function() {});
            it('should return error message of Duplicate Username', function() {});
        });

        describe('Non-Duplicate User', function() {
            it('should create create a new user', function() {});
        });
    });
});
