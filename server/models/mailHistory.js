var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    autoIncrement = require('mongoose-auto-increment');
mongoose.Promise = global.Promise;
var connection = require('../config/database');
const mongo = mongoose.createConnection(connection.database);


autoIncrement.initialize(mongo);

var MailSchema = new Schema({
    to: {
        type: [],
    },
    msg: {
        type: String,
    },
    sendTo: {
        type: String
    },
    sendBy: {
        type: Number
    },
    receiverName: {
        type: String
    }
}, {
    timestamps: { createdAt: 'sendAt', updatedAt: 'updatedAt' },
});

MailSchema.plugin(autoIncrement.plugin, { model: 'mail', startAt: 1 });
module.exports = mongoose.model('mail', MailSchema, 'mail');