var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    autoIncrement = require('mongoose-auto-increment');
mongoose.Promise = global.Promise;
var connection = require('../config/database');
const mongo = mongoose.createConnection(connection.database)

autoIncrement.initialize(mongo);

var OrderSchema = new Schema({
    clientId: {
        required: true,
        type: Number
    },
    jobId: {
        type: Number
    },
    reference: {
        required: true,
        type: String,
    },
    evaluationType: {
        required: true,
        type: String,
    },
    selectedLanguages: {
        required: true,
        type: []
    },
    linguistSize: {
        type: String,
    },
    variantLanguages: {
        type: [],
    },
    variantLinguistSize: {
        type: Number,
    },
    evaluationString: {
        required: true,
        type: [],
    },
    clientPo: {
        type: String
    },
    internalNote: {
        type: String,
    },
    status: {
        type: String,
    },
    dueDate: {
        type: Date,
    },
    evaluationQuestionGroupId: {
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
    instruction: {
        type: String,
    },
    rateBreakdown: {
        type: String,
    },
    anyGender: {
        type: String
    },
    female: {
        type: String
    },
    male: {
        type: String
    },
    pronounciationGuide: {
        type: String
    },
    pronounciationFilePath: {
        type: String
    },
    evaluationFile: {
        type: String
    },
    evaluationFilePath: {
        type: String
    },
    specialInstruction: {
        type: String
    },
    jobDetail: {
        type: {JobSchema}
    },
    answer:[],
    createdBy: {
        type: Number
    },
    downloadParticalReport: {
        type: Boolean
    }
}, {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
});

var JobSchema = new Schema({
    language: {
        type: String
    },
    linguistRequired: {
        type: Number
    },
    linguistAssigned:{
        type:{LinguistSchema}
    } 
});

var LinguistSchema = new Schema({
    language: {
        type: String
    },
    linguistId: {
        type: Number
    },
    ignoreResponse: {
        type: String
    },
    percentage: {
        type: String
    },
    status: {
        type: String
    },
    answer:[]
});
OrderSchema.plugin(autoIncrement.plugin, { model: 'order', startAt: 1 });
module.exports = mongoose.model('order', OrderSchema, 'order');