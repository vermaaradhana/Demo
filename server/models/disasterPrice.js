const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    autoIncrement = require('mongoose-auto-increment');
mongoose.Promise = global.Promise;
const connection = require('../config/database')
const mongo = mongoose.createConnection(connection.database)

autoIncrement.initialize(mongo);

var PriceSchema = new Schema({
    minName: {
        type: Number
    },
    maxName: {
        type: Number
    },
    linguist: {
        type: Number
    },
    price: {
        type: Number
    }
});

PriceSchema.plugin(autoIncrement.plugin, { model: 'disasterPrice', startAt: 1 });
module.exports = mongoose.model('disasterPrice', PriceSchema, 'disasterPrice');