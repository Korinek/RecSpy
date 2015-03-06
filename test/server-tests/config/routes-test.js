var should = require('chai').should(),
    request = require('supertest'),
    express = require('express'),
    app = express();

require('../../../server/config/routes')(app);

describe('Routing', function () {
    /*it('Default route should be defined', function (done) {
        request(app)
            .get('/foo')
            .set('Accept', 'text/html')
            .expect('Content-Type', /html/)
            .expect(200, done);
    });

    it('Client partials route should be defined', function (done) {
        request(app)
            .get('/partials/main/main')
            .set('Accept', 'text/html')
            .expect('Content-Type', /html/)
            .expect(200, done);
    });*/
});

