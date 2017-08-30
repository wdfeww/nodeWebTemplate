module.exports = app => {
    const csurf = require('csurf');

    app.use(csurf());

    app.use((req, res, next) => {
        res.locals.csrfToken = req.csrfToken();
        next();
    });
};