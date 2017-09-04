// Express Validator
module.exports = app => {
    const expressValidator = require('express-validator');
    let User = require('../models/User');

    app.use(expressValidator({
        errorFormatter: (param, msg, value) => {
            let namespace = param.split('.')
                , root    = namespace.shift()
                , formParam = root;

            while(namespace.length) {
                formParam += '[' + namespace.shift() + ']';
            }
            return {
                param : formParam,
                msg   : msg,
                value : value
            };
        },
        customValidators: {
            isUsernameUnique(username) {
                return new Promise((resolve, reject) => {
                    User.isUsernameAlreadyUsed(username, (err, state) => {
                        if (err) throw err;
                        if (state) {
                            reject();
                        } else {
                            resolve();
                        }
                    });
                });
            },
            notEquals(string, string2) {
                return new Promise((resolve, reject) => {
                    if (string === string2) {
                        reject();
                    } else {
                        resolve();
                    }
                });
            }

        }
    }));
};