// MongoDB connection, imports
module.exports = app => {
    const fs = require('fs');
    const mongoose = require('mongoose');
    const db = mongoose.connection;

    let usersJson = require('../imports/import-users.json');
    let avatarPath = '../Haliganda/imports/files/avatar_default.png';
    let User = require('../models/User');
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
        User.remove((err) => {
            if (err) throw err;
            else console.log('Collection users was removed...');

            db.collection('users').insert(usersJson, (err, doc) => {
                if (err) console.log(err.message);
                else console.log('Added collection users with default admin...');
            });

            // User.findOne({username: 'admin'}, (err, admin) => {
            //     if (err) throw err;
            //     admin.avatar_img.data = fs.readFileSync(avatarPath);
            //     admin.avatar_img.contentType = 'image/png';
            //     admin.save((err, admin) => {
            //         if (err) throw err;
            //     });
            // });

        });
        Image.remove((err) => {
            if (err) throw err;
            else console.log('Collection files was removed...')
        })

    });


};

