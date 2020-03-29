const moment = require('moment');

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const STATUS_ACTIVE = 10;
const STATUS_INACTIVE = 0;

let BankSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    branch: {
        type: String,
        required: true
    },
    accountHolder:{
        type: String,
        required: true
    },
    accountNumber: {
        type: String,
        required: true
    },
    status: {
        type: Number,
        default: 10
    },
    createdAt: {
        type: Date,
        default: new Date(moment().set({'hour': moment().hour()+7}).toDate())
    },
    updatedAt: {
        type: Date,
        default: new Date(moment().set({'hour': moment().hour()+7}).toDate())
    }
});

let Bank = mongoose.model('Bank', BankSchema);

module.exports = Bank;