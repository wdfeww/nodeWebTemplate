let express = require('express');
let router = express.Router();
let multer = require('multer');
let multerConf = require('../configurators/multer');

let Article = require('../models/Article');

// Multer configuration
multerConf.cleanFolder('uploads/images');
let upload = multer({
    storage: multerConf.imagesUploads,
    fileFilter: multerConf.imageFilter
});

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

// Add Article
router.get('/new/bs', (req, res) => {
    res.render('new-article-bs-test');
});

// Post New Article
router.post('/new', upload.any(), (req, res) => {
    console.log(req.body);
    var element = JSON.parse(req.body.element);
    // console.log(element[0].name);
    // console.log(element[0].name);
    if (req.files[0])
        console.log(req.files[0].path);

    Article.getAllArticles((err, articles) => {
        if (err) throw err;
        res.render('all-articles', {article: articles});
    });
});

module.exports = router;