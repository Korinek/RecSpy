var logger = require('morgan'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser');

module.exports = function(app) {
    app.use(logger('dev'));
    app.use(cookieParser());
    app.use(bodyParser.urlencoded({
        extended: true,
        limit: '100mb'
    }));
    app.use(bodyParser.json());
};
