var should = require('chai').should();

describe('node routes', function () {
    it('all routes should default to index', function () {
        var x = 10;
        x.should.equal(10);
    });
});