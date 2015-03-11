var expect = require('chai').expect,
    User = require('../../../server/models/User'),
    usersController = require('../../../server/controllers/usersController'),
    dbHelper = require('../helpers/dbHelper');

describe('Users Controller', function() {

    before(function() {
       dbHelper.connectDb(); 
    });

    after(function() {
        dbHelper.closeDb();
    }); 

    describe('Create User', function() {
        describe('Duplicate User', function() {
            it('should return 400 on duplicate username', function() {});
            it('should return error message of Duplicate Username if there was a duplicate username', function() {});
        });

        describe('Non-Duplicate User', function() {
            it('should create create a new user', function() {});
        });
    });
});
