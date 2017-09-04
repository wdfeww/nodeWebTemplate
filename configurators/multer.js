// Multer file uploading exports
const multer = require('multer');
const del = require('del');

// Uploads Storage
module.exports.storageUploads = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'uploads/');
    },
    filename: (req, file, callback) => {
        callback(null, file.originalname);
    }
});

// Profile Pictures
module.exports.avatarUploads = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'uploads/avatars/');
    },
    filename: (req, file, callback) => {
        callback(null, req.user.username+'_avatar');
    }
});

// Clear Folder Uploads after Server Restart
module.exports.cleanFolder = (folderPath) => {
    del.sync([`${folderPath}/**`, `!${folderPath}`]);
    console.log('Cleaning folder '+folderPath+'...');
};

// Images only Filter
module.exports.imageFilter = (req, file, callback) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        // return callback(new Error('Only image files are allowed'), false);
        return callback(console.log('Only .jpg/.jpeg/.png/.gif files are allowed'), false);
    }
    callback(null, true);
};
