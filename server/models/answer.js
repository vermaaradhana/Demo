var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    autoIncrement = require('mongoose-auto-increment');
mongoose.Promise = global.Promise;
var connection = require('../config/database');
const mongo = mongoose.createConnection(connection.database)

autoIncrement.initialize(mongo);

var AnswerSchema = new Schema({
    linguistId: {
        type: Number,
    },
    questionGroupId: {
        type: Number,
    },
    orderId: {
        type: Number
    },
    answer: [],
}, {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
});

AnswerSchema.plugin(autoIncrement.plugin, { model: 'answer', startAt: 1 })
module.exports = mongoose.model('answer', AnswerSchema, 'answer');