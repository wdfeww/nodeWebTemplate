module.exports = app => {
    const passport = require('passport');
    const LocalStrategy = require('passport-local').Strategy;
    const User = require('../models/User');

    // const strategy = new LocalStrategy(User.authenticate());

    // passport.use(strategy);
    // passport.serializeUser(User.serializeUser());
    // passport.deserializeUser(User.deserializeUser());

    // Passport init
    app.use(passport.initialize());
    app.use(passport.session());

};
