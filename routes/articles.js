let express = require('express');
let router = express.Router();

let Article = require('../models/Article');


// All Articles
router.get('/', (req, res) => {
    Article.getAllArticles((err, articles) => {
       if (err) throw err;
       res.render('articles', {article: articles});
    });
});

// Add Article
router.get('/add', (req, res) => {
    res.render('add-article');
});

// Post New Article


module.exports = router;