const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    autoIncrement = require('mongoose-auto-increment');
mongoose.Promise = global.Promise;
const connection = require('../config/database')
const mongo = mongoose.createConnection(connection.database)
var bcrypt = require('bcrypt-nodejs');

autoIncrement.initialize(mongo);

var UserSchema = new Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    }
}, {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
});

UserSchema.pre('save', function(next) {
    var user = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function(err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, null, function(err, hash) {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});

UserSchema.methods.comparePassword = function(passw, cb) {
    bcrypt.compare(passw, this.password, function(err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

UserSchema.plugin(autoIncrement.plugin, { model: 'user', startAt: 1 });
module.exports = mongoose.model('user', UserSchema, 'user');