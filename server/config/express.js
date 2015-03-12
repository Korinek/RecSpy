var logger = require('morgan'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser');

module.exports = function(app) {
    app.use(logger('dev'));
    app.use(cookieParser());
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
};
