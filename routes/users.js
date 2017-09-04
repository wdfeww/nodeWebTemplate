let express = require('express');
let router = express.Router();
let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;
let session = require('express-session');

let User = require('../models/User');

// Login Page
router.get('/login', (req, res) => {
    res.render('login');
});

// Register Page
router.get('/register', (req, res) => {
    res.render('register');
});

router.get('/edit', (req, res) => {
    res.render('profile-edit');
});

// Register User /Post
router.post('/register', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    let rePassword = req.body.rePassword;

    // Validation
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('username', 'Username '+username+' already exists').isUsernameUnique();
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
passport.use(new LocalStrategy((username, password, done) => {
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

// Change Password
router.post('/edit', (req, res) => {
    let oldPassword = req.body.oldPassword;
    let password = req.body.password;
    let rePassword = req.body.rePassword;

    // Validation
    req.checkBody('oldPassword', 'Enter your old password').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password', 'Must contains only ascii symbols').isAscii();
    req.checkBody('rePassword', 'Password do not match!').equals(req.body.password);

    req.getValidationResult().then((errors) => {
        if (!errors.isEmpty()) {
            res.render('profile-edit', {
                errors: errors.array()
            });
        } else {
            let user = req.user;
            User.comparePassword(oldPassword, user.password, (err, isMatch) => {
                if (err) throw err;
                if (isMatch) {
                    user.password = password;
                    User.createUser(user, (err, user) => {
                        if (err) throw err;
                        console.log(user);
                        req.flash('success_msg', 'Your password was changed.');
                        req.logout();
                        res.redirect('/users/login');
                    });
                } else {
                    let errorMsg = [{msg: 'Invalid Password'}];
                    res.render('profile-edit', {errors: errorMsg});
                }
            });
        }
    });
});



// Get Image
router.get('/avatar', (req, res) => {
    res.contentType(req.user.avatar_img.contentType);
    res.send(req.user.avatar_img.data);
});

module.exports = router;