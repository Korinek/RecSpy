var should = require('chai').should(),
    express = require('express'),
    app = express();

var config = {rootPath: "fooRootPath"};

require('../../../server/config/express')(app, config);

var arrayObjectHasProperty = function (arr, propertyName, propertyValue) {
    arr.forEach(function (obj) {
        if(obj['propertyName'] === propertyValue)
        return true;
    });
} ;

describe('Express Configurations', function () {

    it('should use stylus', function () {
        arrayObjectHasProperty(app._router.stack, 'name', 'stylus');
    });

    it('should use a logger', function () {
        arrayObjectHasProperty(app._router.stack, 'name', 'logger');
    });

    it('should use a url encoded parser', function () {
        arrayObjectHasProperty(app._router.stack, 'name', 'urlencodedparser');
    });

    it('should should have static route set', function () {
        arrayObjectHasProperty(app._router.stack, 'name', 'servestatic');
    });
});
