var express = require('express'),
    auth = require('./auth'),
    usersController = require('../controllers/usersController'),
    dashboardController = require('../controllers/dashboardController'),
    employmentController = require('../controllers/employmentController'),
    ownershipController = require('../controllers/ownershipController'),
    membershipController = require('../controllers/membershipController');

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
    app.post('/api/login', auth.authenticate);
    app.post('/api/ownership', auth.requiresLogin, ownershipController.createOwnership);

    app.get('/api/dashboard', auth.requiresLogin, dashboardController.getGymStatistics);
    app.get('/api/employment', auth.requiresLogin, employmentController.getEmployment);
    app.get('/api/ownership', auth.requiresLogin, ownershipController.getOwnership);
    app.get('/api/memberships', auth.requiresLogin, membershipController.getMemberships);

    app.post('/logout', function(req, res) {
        req.logout();
        res.end();
    });

    app.all('/api/*', function(req, res) {
        res.sendStatus(404);
    });
};
