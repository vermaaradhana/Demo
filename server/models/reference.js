var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    autoIncrement = require('mongoose-auto-increment');
mongoose.Promise = global.Promise;
var connection = require('../config/database');
const mongo = mongoose.createConnection(connection.database);


autoIncrement.initialize(mongo);

var ReferenceSchema = new Schema({
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    fileName: {
        type: String
    },
    filePath: {
        type: String
    },
    createdBy: {
        type: Number
    }
}, {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
});

ReferenceSchema.plugin(autoIncrement.plugin, { model: 'reference', startAt: 1 });
module.exports = mongoose.model('reference', ReferenceSchema, 'reference');