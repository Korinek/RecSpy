var express = require('express');

module.exports = function (app, config) {
    if (process.env.NODE_ENV === 'build') {
        console.log('*** BUILD ***');
        app.use(express.static('./build/'));
        app.get('/app/*', function (req, res) {
            res.sendFile(config.rootPath + '/client/app/' + req.params[0]);
        });
    } else {
        console.log('*** DEVELOPMENT ***');
        app.use(express.static('./client/'));
        app.use(express.static('./'));
        app.use(express.static('./temp'));
    }
};