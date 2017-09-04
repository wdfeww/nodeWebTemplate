let express = require('express');
let multer = require('multer');
let bodyParser = require('body-parser');
let fs = require('fs');
let router = express.Router();

let Image = require('../models/Image');
const folderPath = 'uploads';

const multerConf = require('../configurators/multer');

// Cleaning uploads folder after server restart
multerConf.cleanFolder(folderPath);

let upload = multer({
    storage: multerConf.storageUploads,
    fileFilter: multerConf.imageFilter
});

// Upload Image
router.post('/image', upload.any(), (req, res) => {
    // res.send(req.files);

    let path = req.files[0].path;
    let imageName = req.files[0].originalname;

    console.log('path: '+path);
    console.log('imageName: '+imageName);

    let newImage = new Image({
        path: path,
        originalname: imageName
    });

    Image.addImage(newImage, (err, image) => {
        if (err) throw err;
        console.log(image);
        req.flash('avatar', '/'+image.originalname);
        res.redirect('/');
    });

});

router.get('/image/:id', (req, res) => {
    Image.getImageById(req.params.id, (err, image) => {
        if (err) throw err;
        console.log(image);
        console.log(image.path);
        res.render('index', {image: image.path});
    })
});

module.exports = router;