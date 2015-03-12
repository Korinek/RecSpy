var expect = require('chai').expect,
    sinon = require('sinon'),
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

        var createMockRequest = function() {
            return {
                body: {
                    username: 'fooUsername',
                    password: 'fooPassword',
                    lastName: 'fooLastName',
                    firstName: 'fooFirstName'
                },
                logIn: sinon.spy()
            }
        };

        var createMockResponse = function() {
            return {
                status: sinon.spy(),
                send: sinon.spy()
            }
        };

        var createMockNext = sinon.spy();

        describe('Duplicate User', function() {

            beforeEach(function() {
                usersController.createUser(createMockRequest(), createMockResponse(), createMockNext());
            });

            it('should set reponse status to 400 on duplicate username', function(done) {
                var res = createMockResponse();
                res.send = function() {
                    expect(res.status.calledWith(400)).to.be.true;
                    done();
                };
                usersController.createUser(createMockRequest(), res, createMockNext());
            });

            it('should return error message of Duplicate Username if there was a duplicate username', function(done) {
                var res = createMockResponse();
                res.send = function(response) {
                    expect(response.reason).to.equal('Error: Duplicate Username');
                    done();
                };
                usersController.createUser(createMockRequest(), res, createMockNext());
            });
        });

        describe('Non-Duplicate User', function() {
            /*it('should create create a new user', function(done) {
                var res = createMockResponse();
                res.send = function() {
                    User.where({
                        username: 'fooUserName'
                    }).findOne(function(err, user) {
                        if (err) return done(err);
                        expect(user).to.exist;
                        done();
                    });
                };
                usersController.createUser(createMockRequest(), res, createMockNext());
            });*/
        });
    });
});
