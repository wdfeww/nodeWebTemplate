let express = require('express');
let router = express.Router();

let Article = require('../models/Article');


// Login Page
router.get('/', (req, res) => {
    Article.getAllArticles((err, articles) => {
       if (err) throw err;
       res.render('articles', {article: articles});
    });
});

module.exports = router;