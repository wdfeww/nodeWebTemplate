// MongoDB connection, imports
module.exports = app => {
    const fs = require('fs');
    const mongoose = require('mongoose');
    const db = mongoose.connection;

    let usersJson = require('../imports/import-users.json');
    let articlesJson = require('../imports/import-articles.json');
    let avatarPath = '../Haliganda/imports/files/avatar_default.png';
    let User = require('../models/User');
    let Article = require('../models/Article');
    let Image = require('../models/Image');

    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost/haliganda', {
        useMongoClient: true
    });

    mongoose.connection.on('connected', () => {
        console.log('Database is connected...');
    });
    mongoose.connection.on('disconnected', () => {
        console.log('Database is disconnected...');
    });

    // Inserting default admin into Database
    mongoose.connection.on('open', () => {
        console.log('<<< Updating Database... >>>');
        User.remove((err) => {
            if (err) throw err;
            else console.log('Collection users was removed...');

            // Filling database with some users...
            db.collection('users').insert(usersJson, (err, doc) => {
                if (err) console.log(err.message);
                else console.log('Added collection users with default admin...');
            });
        });

        Article.remove((err) => {
            if (err) throw err;
            else console.log('Collection articles was removed...');

            // Filling database with some articles
            db.collection('articles').insert(articlesJson, (err, doc) => {
                if (err) console.log(err.message);
                else console.log('Added collection articles with some articles...');
            });
        });


        // Clearing collection with files...
        Image.remove((err) => {
            if (err) throw err;
            else console.log('Collection files was removed...')
        })

    });


};

