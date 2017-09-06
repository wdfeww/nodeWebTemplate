// View Engine
module.exports = app => {

    const exphbs = require('express-handlebars');
    const handlebars = exphbs.create({
        layoutsDir: 'views/layouts',
        partialsDir: 'views/partials',
        defaultLayout: 'layout',
        helpers: {
            compare: function (lvalue, operator, rvalue, options) {

                let operators, result;

                if (arguments.length < 3) {
                    throw new Error("Handlerbars Helper 'compare' needs 2 parameters");
                }

                if (options === undefined) {
                    options = rvalue;
                    rvalue = operator;
                    operator = "===";
                }

                operators = {
                    '==': function (l, r) { return l == r; },
                    '===': function (l, r) { return l === r; },
                    '!=': function (l, r) { return l != r; },
                    '!==': function (l, r) { return l !== r; },
                    '<': function (l, r) { return l < r; },
                    '>': function (l, r) { return l > r; },
                    '<=': function (l, r) { return l <= r; },
                    '>=': function (l, r) { return l >= r; },
                    'typeof': function (l, r) { return typeof l == r; }
                };

                if (!operators[operator]) {
                    throw new Error("Handlerbars Helper 'compare' doesn't know the operator " + operator);
                }

                result = operators[operator](lvalue, rvalue);

                if (result) {
                    return options.fn(this);
                } else {
                    return options.inverse(this);
                }

            }
        }
    });

    app.engine('handlebars', handlebars.engine);
    app.set('views', 'views');
    app.set('view engine', 'handlebars');
};