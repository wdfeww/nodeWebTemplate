let mongoose = require('mongoose');

// Article Schema
let ArticleSchema = mongoose.Schema({
    // createDate: {
    //     type: Date,
    //     default: new Date()
    // },
    // h1: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },
    // article: [{
    //     h2: {
    //         type: String
    //     },
    //     body: {
    //         type: String
    //     }
    // }],
    // picture: [{
    //     path: {
    //         type: String,
    //         trim: true
    //     },
    //     originalname: {
    //         type: String,
    //         trim: true
    //     }
    // }]
    //add date, unique article name???

    title: {
        type: String,
        required: true
    },
    body: {
      type: String,
      required: true
    },
    dateOfCreate:{
        type: Date,
        required: true
    },
    images: [{
        path: {
            type: String
        },
        originalName: {
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
