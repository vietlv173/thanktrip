const moment = require('moment');

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const STATUS_DELETE = 1;
const STATUS_ACTIVE = 2;

let QuoteSchema = new Schema({
    quote_id: {
        type: Number, required: true
    }, details: Object, status: {
        type: Number, default: 1
    }, createdAt: {
        type: Date, default: new Date(moment().set({'hour': moment().hour() + 7}).toDate())
    }, updatedAt: {
        type: Date, default: new Date(moment().set({'hour': moment().hour() + 7}).toDate())
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
});

let Quote = mongoose.model('Quote', QuoteSchema);

module.exports = Quote;