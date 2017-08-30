// View Engine
module.exports = app => {

    const exphbs = require('express-handlebars');
    const handlebars = exphbs.create({
        layoutsDir: 'views/layouts',
        partialsDir: 'views/partials',
        defaultLayout: 'layout'
    });

    app.engine('handlebars', handlebars.engine);
    app.set('views', 'views');
    app.set('view engine', 'handlebars');
};