let mongoose = require('mongoose');

// Article Schema
let ArticleSchema = mongoose.Schema({

    h1: {
        type: String,
        required: true,
        trim: true
    },
    article: [{
        h2: {
            type: String,
            trim: true
        },
        body: {
            type: String
        }
    }],
    picture: [{
        path: {
            type: String,
            trim: true
        },
        originalname: {
            type: String,
            trim: true
        }
    }]
    //add date, unique article name???
});

// Article Model
let Article = module.exports = mongoose.model('Article', ArticleSchema);

module.exports.createArticle = (newArticle, callback) => {
    Article.create(callback);
};

module.exports.getAllArticles = (callback) => {
    Article.find({}, (err, articles) => {
       if (err) callback(err, null);
       callback(null, articles);
    });
};
