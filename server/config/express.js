var express = require('express'),
    stylus = require('stylus'),
    logger = require('morgan'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    passport = require('passport');

module.exports = function (app, config) {
    app.use(logger('dev'));
    app.use(cookieParser());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());
    app.use(session({
        secret: process.env.SESSION_SECRET || 'RecSpy Session Secret',
        name: process.env.SESSION_NAME || 'RecSpy Session NAME',
        resave: true,
        saveUninitialized: true

    }));
    app.use(passport.initialize());
    app.use(passport.session());
};
