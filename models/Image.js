let mongoose = require('mongoose');

// Image Schema
let ImageSchema = mongoose.Schema({
    path: {
        type: String,
        required: true,
        trim: true
    },
    originalname: {
        type: String,
        required: true,
        index: {
            unique: true,
            dropDups: true
        }
    }
});

// Image Model
let Image = module.exports = mongoose.model('files', ImageSchema);

module.exports.getImageByOriginalName = (name, callback) => {
    Image.findOne({originalname: name}, (err, image) => {
        if (err) callback(err, null);
        callback(null, image);
    });
};

module.exports.getImageById = (id, callback) => {
    Image.findById(id, (err, image) => {
        if (err) callback(err, null);
        callback(null, image);
    });
};

module.exports.addImage = (newImage, callback) => {
    Image.create(newImage, callback);
};