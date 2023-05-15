const moment = require('moment');

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const STATUS_PENDING = 1;
const STATUS_PAYED = 2;
const STATUS_FINISH = 3;
const STATUS_CANCEL = 4;

let OrderSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    }, order_id: {
        type: String, required: true
    }, tpe: {
        type: Number, required: true, default: 1
    }, revenue: {
        type: Number, default: 0
    }, commission: {
        type: Number, default: 0
    }, service_detail: Object, status: {
        type: Number, default: 1
    }, createdAt: {
        type: Date, default: new Date(moment().set({'hour': moment().hour() + 7}).toDate())
    }, updatedAt: {
        type: Date, default: new Date(moment().set({'hour': moment().hour() + 7}).toDate())
    },
    createBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
});

let Order = mongoose.model('Order', OrderSchema);

module.exports = Order;