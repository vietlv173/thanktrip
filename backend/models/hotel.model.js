const moment = require('moment');

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const STATUS_PENDING = 1;
const STATUS_OPEN = 2;
const STATUS_CLOSE = 3;

let HotelSchema = new Schema({
    title: {
        type: String, required: true
    },
    phone: {
        type: String, required: true
    },
    email: {
        type: String, required: true
    },
    bank_id: {
        type: String, required: true
    },
    accountHolder: {
        type: String, required: true
    },
    accountNumber: {
        type: String, required: true
    },
    tpe: {
        type: Number, required: true
    }, province_id: {
        type: Number, required: true
    }, address: {
        type: String, required: true
    }, room_detail: Object, surcharge: {
        type: Number, default: 0, required: true
    }, service_detail: Object, note: {
        type: String, required: true
    }, room_included: {
        type: String, required: true
    }, check_in: {
        type: String, required: true
    }, check_out: {
        type: String, required: true
    }, child_policy: {
        type: String, required: true
    }, free_service: {
        type: String, required: true
    }, refund_policy: {
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

let Hotel = mongoose.model('Hotel', HotelSchema);

module.exports = Hotel;