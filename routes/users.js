let express = require('express');
let router = express.Router();
let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;
let session = require('express-session');
let multer = require('multer');

let User = require('../models/User');

const multerConf = require('../configurators/multer');

let upload = multer({
    // destination: 'uploads/avatars/',
    storage: multerConf.avatarUploads,
    fileFilter: multerConf.imageFilter
});

// const app = express();

// app.use(upload.single('demo'));

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

// Register User
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
    req.session.destroy();

    res.redirect('/users/login');
});

// Change Password
router.post('/edit', (req, res) => {
    let oldPassword = req.body.oldPassword;
    let password = req.body.password;

    // Validation
    req.checkBody('oldPassword', 'Enter your old password').notEmpty();
    req.checkBody('password', 'Your new password can not be your old one').notEquals(req.body.oldPassword, req.body.password);
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

// Change Avatar
router.post('/edit/avatar', upload.any(), (req, res) => {
    // res.render('upload', {
    //     csrf: req.csrfToken()
    // });
    // res.end();
    if (req.files[0]) {
        let path = req.files[0].path;
        let imageName = req.files[0].filename;

        console.log('path: '+path);
        console.log('imageName: '+imageName);

        let user = req.user;
        user.avatar.path = '\\avatars\\'+imageName;
        user.avatar.originalname = imageName;

        User.createUser(user, (err, user) => {
            if (err) throw err;
            console.log(user);
            req.flash('success_msg', 'Your profile picture was changed.');
            res.redirect('/');
        });
    } else {
        let errorMsg = [{msg: 'Only .jpg/.jpeg/.png/.gif files are allowed'}];
        res.render('profile-edit', {errors: errorMsg});
    }
});

module.exports = router;