var expect = require('chai').expect,
    mongoose = require('mongoose'),
    Address = require('../../../server/models/Address');

describe('Address Model', function () {

    before(function () {
        mongoose.connect('mongodb://localhost/test');
    });

    after(function () {
        mongoose.connection.close();
    });

    beforeEach(function (done) {
        Address.remove({}, function () {
            done();
        });
    });

    it('should be able to create', function (done) {
        Address.create({
            country: 'United States',
            stateRegionOrProvince: 'Kansas',
            zip: 66502,
            city: 'Some City',
            streetAddress: '2027 Some Street',
            phone: 123456789
        }, function (err) {
            if(err) throw err;
            done();
        });
    });

    describe('Property Attributes', function () {
        var isPropertyRequired = function (propertyName) {
            return Address.schema.path(propertyName).isRequired;
        };

        it('should require the country', function () {
            expect(isPropertyRequired('country')).to.be.true;
        });

        it('should require the state/region/province', function () {
            expect(isPropertyRequired('stateRegionOrProvince')).to.be.true;
        });

        it('should require the the zip code', function () {
            expect(isPropertyRequired('zip')).to.be.true;
        });

        it('should require the city name', function () {
            expect(isPropertyRequired('city')).to.be.true;
        });

        it('should require the street address', function () {
            expect(isPropertyRequired('streetAddress')).to.be.true;
        });

        it('should make the phone number optional', function () {
            expect(isPropertyRequired('phoneNumber')).to.be.false;
        });
    });
});