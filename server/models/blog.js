var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    autoIncrement = require('mongoose-auto-increment');
mongoose.Promise = global.Promise;
var connection = require('../config/database');
const mongo = mongoose.createConnection(connection.database);


autoIncrement.initialize(mongo);

var BlogSchema = new Schema({
    comment: {
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

BlogSchema.plugin(autoIncrement.plugin, { model: 'blog', startAt: 1 });
module.exports = mongoose.model('blog', BlogSchema, 'blog');