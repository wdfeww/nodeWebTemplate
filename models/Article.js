let mongoose = require('mongoose');

// Article Schema
let ArticleSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    titleImage: {
        path: {
            type: String
        },
        originalName: {
            type: String
        },
        alt: {
            type: String
        }
    },
    body: {
      type: String,
      required: true
    },
    dateOfCreate:{
        type: Date,
        default: Date.now
    },
    images: [{
        path: {
            type: String
        },
        originalName: {
            type: String
        },
        alt: {
            type: String
        }
    }]
});

// Article Model
let Article = module.exports = mongoose.model('Article', ArticleSchema);

module.exports.createArticle = (newArticle, callback) => {
    Article.create(newArticle, callback);
};

module.exports.getAllArticles = (callback) => {
    Article.find({}, (err, articles) => {
       if (err) callback(err, null);
       callback(null, articles);
    });
};
