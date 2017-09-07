let express = require('express');
let router = express.Router();

let Article = require('../models/Article');

// All Articles
router.get('/', (req, res) => {
    Article.getAllArticles((err, articles) => {
        if (err) throw err;
        res.render('all-articles', {article: articles});
    });
});

// Article
router.get('/title', (req, res) => {
    Article.getAllArticles((err, articles) => {
       if (err) throw err;
       res.render('article', {article: articles});
    });
});

// Add Article
router.get('/new', (req, res) => {
    res.render('new-article');
});

// Post New Article
router.post('/new', (req, res) => {
    console.log(req.body);
    var element = JSON.parse(req.body.element);
    Article.getAllArticles((err, articles) => {
        if (err) throw err;
        res.render('all-articles', {article: articles});
    });
});

module.exports = router;