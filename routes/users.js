let express = require('express');
let router = express.Router();
let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;

let User = require('../models/User');

// Login
router.get('/login', (req, res) => {
    res.render('login');
});

// Register
router.get('/register', (req, res) => {
    res.render('register');
});

// Register User
router.post('/register', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    let rePassword = req.body.rePassword;

    // Validation
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('username', 'Username '+username+' already exists').isUsernameUnique();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password', 'Must contains only ascii symbols').isAscii();
    req.checkBody('rePassword', 'Password do not match!').equals(req.body.password);

    req.getValidationResult().then((errors) => {
        if (!errors.isEmpty()) {
            res.render('register', {
                errors: errors.array()
            });
        } else {
            let newUser = new User({
                username: username,
                password: password
            });
            User.createUser(newUser, (err, user) => {
                if (err) throw err;
                console.log(user);
            });

            req.flash('success_msg', 'You are registered and can now login.');

            res.redirect('/users/login')
        }
    });
});

// Login User
passport.use(new LocalStrategy(
    function(username, password, done) {
        User.getUserByUsername(username, (err, user) => {
            if (err) throw err;
            if (!user) {
                return done(null, false, {message: 'Unknown User'});
            }
            User.comparePassword(password, user.password, (err, isMatch) => {
                if (err) throw err;
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, {message: 'Invalid Password'});
                }
            })
        });
    }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.getUserById(id, function(err, user) {
        done(err, user);
    });
});

router.post('/login',
    passport.authenticate('local', {successRedirect: '/', failureRedirect: '/users/login', failureFlash: true}),
    (req, res) => {
        res.redirect('/');
    });

// Logout User
router.get('/logout', (req, res) => {
   req.logout();

   req.flash('success_msg', 'You are logged out');

   res.redirect('/users/login');
});

module.exports = router;