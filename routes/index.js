let express = require('express');
let router = express.Router();

// Get Homepage
router.get('/', ensureAuthenticated, (req, res) => {
    res.render('index');
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        //req.flash('error_msg', 'You are not logged in');
        res.redirect('/users/login');
    }
}

module.exports = router;