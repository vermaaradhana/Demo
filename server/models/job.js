var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    autoIncrement = require('mongoose-auto-increment');
mongoose.Promise = global.Promise;
var connection = require('../config/database');
const mongo = mongoose.createConnection(connection.database)

autoIncrement.initialize(mongo);

var JobSchema = new Schema({
    clientId: {
        required: true,
        type: Number,
    },
    orderId: {
        required: true,
        type: Number,
    },
    evaluationString: {
        type: String,
    },
    evaluationQuestionGroupId: {
        required: true,
        type: Number,
    },
    ttgJobNumber: {
        type: String,
    },
    clientDueDate: {
        type: Date,
    },
    price: {
        type: Number,
    },
    primer: {
        type: String,
    },
    jobDetail: {
        type: [],
    },
    rateBreakdown: {
        type: String,
    },
    linguistDetail: [],
    varianrLinguistDetail: [],
    specialInstruction: {
        type: String
    },
    status: {
        type: String
    },
    nameSize: {
        type: Number
    },
    linguistSize: {
        type: Number
    },
    createdBy: {
        type: Number
    },
    downloadParticalReport: {
        type: Boolean
    }
}, {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
});

JobSchema.plugin(autoIncrement.plugin, { model: 'job', startAt: 1 });
module.exports = mongoose.model('job', JobSchema, 'job');