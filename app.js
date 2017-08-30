let express = require('express');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
// Init App
const app = express();

require('./configurators/body')(app);
require('./configurators/mongo')(app);
require('./configurators/handlebars')(app);
require('./configurators/validation')(app);
require('./configurators/session')(app);
require('./configurators/passport')(app);
require('./configurators/csrf')(app);

const routes = require('./routes/index');
const users = require('./routes/users');

// Set Static Folder
app.use(express.static('public'));

// Cookie Parser
app.use(cookieParser());

// Connect Flash
app.use(flash());

app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.isAuthenticated = req.isAuthenticated();
    res.locals.user = req.user || null;
    next();
});

app.use('/', routes);
app.use('/users', users);

// Set Port
app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), () => {
    console.log('Server started on port '+app.get('port'));
});
