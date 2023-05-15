const moment = require('moment');

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const STATUS_FINISH = 4;
const STATUS_REJECT = 3;
const STATUS_CANCEL = 2;
const STATUS_WAITING = 1;

let TransactionSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    bank: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bank'
    },
    amount: {
        type: Number,
        required: true
    },
    note: {
        type: String
    },
    image: {
        type: String
    },
    status: {
        type: Number,
        default: 1
    },
    createdAt: {
        type: Date,
        default: new Date(moment().set({'hour': moment().hour() + 7}).toDate())
    },
    updatedAt: {
        type: Date,
        default: new Date(moment().set({'hour': moment().hour() + 7}).toDate())
    }
});

let Transaction = mongoose.model('Transaction', TransactionSchema);

module.exports = Transaction;