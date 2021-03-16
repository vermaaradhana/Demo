const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    autoIncrement = require('mongoose-auto-increment');
mongoose.Promise = global.Promise;
const connection = require('../config/database')
const mongo = mongoose.createConnection(connection.database)

autoIncrement.initialize(mongo);

var replySchema = new Schema({
    blogId: {
        type: Number
    },
    commentBy: {
        type: Number
    },
    msg: {
        type: String
    }
}, {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
});

replySchema.plugin(autoIncrement.plugin, { model: 'reply', startAt: 1 });
module.exports = mongoose.model('reply', replySchema, 'reply');