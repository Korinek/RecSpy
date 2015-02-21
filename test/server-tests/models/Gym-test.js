var expect = require('chai').expect,
    mongoose = require('mongoose'),
    Address = require('../../../server/models/Address'),
    Gym = require('../../../server/models/Gym');

describe('Gym Model', function () {

    before(function () {
        mongoose.connect('mongodb://localhost/test');
    });

    after(function () {
        mongoose.connection.close();
    });

    beforeEach(function (done) {
       Gym.remove({}, function () {
           done();
       });
    });

    it('should be able to create', function (done) {
        Gym.create({
            name: 'fooGymName',
            address: new Address({
                country: 'United States',
                stateRegionOrProvince: 'Kansas',
                zip: 66502,
                city: 'Some City',
                streetAddress: '2027 Some Street',
                phone: 123456789
            })
        }, function (err) {
            if(err) throw err;
            done();
        });
    });

    describe('Property Attributes', function () {

        var getProperty = function (propertyName) {
            return Gym.schema.path(propertyName);
        };

        var isPropertyRequired = function (propertyName) {
            return getProperty(propertyName).isRequired;
        };

        it('should require a name', function () {
            expect(isPropertyRequired('name')).to.be.true;
        });

        it('should require an address', function () {
            expect(isPropertyRequired('address')).to.be.true;
        });

        it('should be unique based on address', function () {
            expect(getProperty('address')._index.unique).to.be.true;
        });
    });
});