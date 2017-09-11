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

// Post New Article
router.post('/new', upload.any(), (req, res) => {
    // if (req.files[0]){
    //
    //     console.log(req.files[0].path);
    //     console.log(req.files[1].path);
    // }
    // console.log(req.body);



    let newArticle = new Article({
        title: req.body.title,
        body: req.body.articleBody,
        dateOfCreate: req.body.dateOfCreate,
        images: []
    });

    if (req.files[0]) {
        let i = 0;
        let fileName = ' ';
        while (req.files[i]) {
            let fileName = req.files[i].filename;
            let image = {
                path: '\\images\\'+fileName,
                originalName: fileName
            };
            newArticle.images.push(image);
            i++;
        }
        console.log('pridavam image');
    }

    let newPromise = (newArticle) => {
        return new Promise((resolve, reject) => {
            if (newArticle)
                resolve();
            else
                reject();
        });
    };

    newPromise(newArticle).then(() => {
        console.log('vytvaram article');
        console.log(newArticle);
        Article.createArticle(newArticle, (err, article) => {
            if (err) throw err;
            console.log('article: '+article);
            Article.getAllArticles((err, articles) => {
                if (err) throw err;
                res.render('all-articles', {article: articles});
            });
        });
    });


});

module.exports = router;