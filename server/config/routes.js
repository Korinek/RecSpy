var express = require('express');

module.exports = function (app) {
    /*app.get('*', function (req, res) {
     console.log('************');
     console.log(req.url);
     console.log('************');
     res.render('./client/index.html');
     });*/

    if (process.env.NODE_ENV === 'build') {
        console.log('*** BUILD ***');
        app.use(express.static('./build/'));
    } else {
        console.log('*** DEVELOPMENT ***');
        app.use(express.static('./client/'));
        app.use(express.static('./'));
        app.use(express.static('./temp'));
    }
};