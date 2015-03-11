var express = require('express'),
    auth = require('./auth'),
    usersController = require('../controllers/usersController');

module.exports = function(app, config) {
    if (process.env.NODE_ENV === 'build') {
        console.log('*** BUILD ***');
        app.use(express.static('./build/'));
        app.get('/app/*', function(req, res) {
            res.sendFile(config.rootPath + '/client/app/' + req.params[0]);
        });
    } else {
        console.log('*** DEVELOPMENT ***');
        app.use(express.static('./client/'));
        app.use(express.static('./'));
        app.use(express.static('./temp'));
    }

    app.post('/api/users', usersController.createUser);

    app.post('/login', auth.authenticate);

    app.post('/fooAuthenticate', auth.authenticate);

    app.post('/logout', function(req, res) {
        req.logout();
        res.end();
    });

    app.all('/api/*', function(req, res) {
        res.send(404);
    });
};
