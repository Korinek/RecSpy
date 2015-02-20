var expect = require('chai').expect,
    encryption = require('../../../server/utilities/encryption');

describe('Encryption', function () {

    describe('Create Salt', function () {
        it('should create different salts each time', function () {
            var saltOne = encryption.createSalt();
            var saltTwo = encryption.createSalt();
            expect(saltOne).to.not.equal(saltTwo);
        });

        it('should create base64 salt strings', function () {
            var base64Matcher = new RegExp("^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$");
            expect(base64Matcher.test(encryption.createSalt())).to.be.true;
        });

        it('should create salt strings 172 characters long', function () {
            expect(encryption.createSalt().length).to.equal(172);
        });
    });

    describe('Hash Password', function () {

        var saltOne = 'faKt+ueCLVShavEF/rgdxA7jT7lAHkphBZYMQj12Cok0fRbEEchvNXsnMppleLH6FJ2s9mkheY1y3bf+MaJAFfzfRuCI+/xma444wh17mbTFUMXGhgo1nxfwCxr7Wz+nNrSlyQ9WpfBMm8zoIrXr3jBbz7QKFIX/Ny9IIC2n1n0=';
        var saltTwo = 'QXV9bhEJdQTcvApBavRp12+oFbofvC02jgTYbTgzhtlgLcx8ZeuH+I8+zCui25GZ37zKUtObcfoZ9XJ+eulR1h9t30rZMg7tvQIy2x9GJpU5DaPZaUoWu7YTt/IZQlWcmBKIbF05ydQG4iVd7c5rngqiHo5hlv8K5guTFvl9C3k=';
        var password = 'fooPassword';

        it('should get same hash when using the same salt', function () {
            var hashedPasswordOne = encryption.hashPassword(saltOne, password);
            var hashedPasswordTwo = encryption.hashPassword(saltOne, password);
            expect(hashedPasswordOne).to.equal(hashedPasswordTwo);
        });

        it('should get a different hash when using a different salt', function () {
            var hashedPasswordOne = encryption.hashPassword(saltOne, password);
            var hashedPasswordTwo = encryption.hashPassword(saltTwo, password);
            expect(hashedPasswordOne).to.not.equal(hashedPasswordTwo);
        });
    });
});