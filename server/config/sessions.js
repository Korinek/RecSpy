var session = require('express-session'),
    passport = require('passport'),
    mongoose = require('mongoose'),
    MongoStore = require('connect-mongo')(session);

module.exports = function(app) {
    app.use(session({
        secret: process.env.SESSION_SECRET || 'RecSpy Session Secret',
        name: 'RecSpy Session',
        store: new MongoStore({
            mongooseConnection: mongoose.connection
        }),
        cookie: {
                    maxAge: new Date(Date.now() + 1000 * 60 * 24 * 31) //31 days
            },
            resave: true,
            saveUninitialized: true
    }));
    app.use(passport.initialize());
    app.use(passport.session());

};
