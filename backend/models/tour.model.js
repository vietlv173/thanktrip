const moment = require('moment');

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const STATUS_PENDING = 1;
const STATUS_OPEN = 2;
const STATUS_CLOSE = 3;

let TourSchema = new Schema({
    title: {
        type: String, required: true
    }, from_id: {
        type: Number, required: true
    }, to_id: {
        type: Number, required: true
    }, departure_date: {
        type: String, required: true
    }, price_detail: Object, surcharge: {
        type: Number, default: 0, required: true
    }, link: {
        type: String, required: true
    }, commission: {
        type: Number, default: 0, required: true
    }, status: {
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

let Tour = mongoose.model('Tour', TourSchema);

module.exports = Tour;