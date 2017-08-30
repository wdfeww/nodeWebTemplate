// Express Session, MongoDB Session store
module.exports = app => {
    const session = require('express-session');
    const mongoose = require('mongoose');
    const connectMongo = require('connect-mongo');

    const MongoStore = connectMongo(session);

    const sessionConfiguration = {
        secret: 'secret',
        saveUninitialized: true,
        resave: true,
        store: new MongoStore({
            mongooseConnection: mongoose.connection
        })
    };
    app.use(session(sessionConfiguration));

    app.use((req, res, next) => {
        // if(!req.session.items) {
        //     req.sesion.items = [];
        // }
        res.locals.items = req.session.items || [];
        next();
    });
};