let mongoose = require('mongoose');
let bcrypt = require('bcryptjs');
let passportLocalMongoose = require('passport-local-mongoose');

// User Schema
let UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        index: {
            unique: true,
            dropDups: true
        }
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        path: {
            default: '/images/avatars/avatar_default.png',
            type: String,
            trim: true
        },
        originalname: {
            default: 'avatar_default.png',
            type: String,
        }
    }
});

UserSchema.plugin(passportLocalMongoose);

// User Model
let User = module.exports = mongoose.model('User', UserSchema);

// New/Update User
module.exports.createUser = (newUser, callback) => {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            if (hash) {
                newUser.password = hash;
                newUser.save(callback);
            }
        });
    });
};

module.exports.isUsernameAlreadyUsed = (username, callback) => {
    User.find({username: username}, (err, users) => {
        if (err) callback(err, false);
        Object.keys(users).length?callback(null, true):callback(null, false);
    });
};

module.exports.getUserByUsername = (username, callback) => {
    let query = {username: username};
    User.findOne(query, callback);
};

module.exports.getUserById = (id, callback) => {
    User.findById(id, callback);
};

module.exports.comparePassword = (enteredPassword, hash, callback) => {
    bcrypt.compare(enteredPassword, hash, (err, isMatch) => {
        if(err) throw err;
        callback(null, isMatch);
    });
};