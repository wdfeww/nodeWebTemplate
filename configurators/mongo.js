// MongoDB connection
module.exports = app => {
    var json = require('../import-users.json');

    const mongoose = require('mongoose');
    const db = mongoose.connection;

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
    db.collection('users').insert(json, (err, doc) => {
        if (err) console.log(err.message);
        else
            console.log('Default admin was inserted into users collection...');
    });
}