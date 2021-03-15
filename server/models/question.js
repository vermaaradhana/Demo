var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    autoIncrement = require('mongoose-auto-increment');
mongoose.Promise = global.Promise;
var connection = require('../config/database');
const mongo = mongoose.createConnection(connection.database)

autoIncrement.initialize(mongo);
var QuestionSchema = new Schema({
    questionString: {
        type: String
    },
    questionHeading: {
        type: String
    },
    answerType: {
        type: String
    },
    answerOption: {
        type: String
    },
    rating: {
        type: String
    },
    ratingForOthers: {
        type: String
    }
});

var QuestionGroupSchema = new Schema({
    questionGroupName: {
        type: String,
    },
    evaluationType: {
        type: String,
    },
    question: [QuestionSchema],
    createdBy: {
        type: Number
    }

}, {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
});
QuestionSchema.plugin(autoIncrement.plugin, { model: 'question', startAt: 1 });
QuestionGroupSchema.plugin(autoIncrement.plugin, { model: 'questionGroup', startAt: 1 });
module.exports = mongoose.model('questionGroup', QuestionGroupSchema, 'questionGroup');