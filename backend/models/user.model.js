const moment = require('moment');

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const ROLE_NV = 4;
const ROLE_CTV = 2;
const ROLE_USER = 3;
const ROLE_ADMIN = 1;

const STATUS_ACTIVE = 10;
const STATUS_INACTIVE = 0;
const STATUS_DELETED = -1;

let UserSchema = new Schema({
    code: {
        type: String
    },
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    avatar:{
        type:String
    },
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
    roleId: {
        type: Number,
        required: true,
    },
    status: {
        type: Number,
        required: true,
    },
    address: {
        type: String
    },
    note: {
        type: String
    },
    commission:{
        type:Number,
        default:0
    },
    wallet:{
        type:Number,
        default:0
    },
    discount:{
        type:Number,
        default:0
    },
    flights: [{ type: Schema.Types.ObjectId, ref: 'Flight' }],
    banks:[{ type: Schema.Types.ObjectId, ref: 'Bank' }],
    transactions:[{ type: Schema.Types.ObjectId, ref: 'Transaction' }],
    createdAt: {
        type: Date,
        default: new Date(moment().set({'hour': moment().hour()+7}).toDate())
    },
    updatedAt: {
        type: Date,
        default: new Date(moment().set({'hour': moment().hour()+7}).toDate())
    }
});

UserSchema.statics.authenticate = function (username, password, callback) {
    User.findOne({username: username}).exec(function (err, user) {
        if (err) {
            return callback(err)
        } else if (!user) {
            let err = new Error('User not found.');
            err.status = 401;
            return callback(err);
        }

        bcrypt.compare(password, user.password, function (err, result) {
            if (result === true) {
                return callback(null, user);
            } else {
                return callback();
            }
        })
    });
};

function slugName(text) {
    return text.toString().toLowerCase()
        .replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a')
        .replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e')
        .replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i')
        .replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o')
        .replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u')
        .replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y')
        .replace(/đ/gi, 'd');
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min + 1)) + min;
}

UserSchema.pre('save', function (next) {
    let user = this;

    let string = user.fullName.split(' ');

    let slug = slugName(string[string.length - 1]).toUpperCase();

    let max = 10;

    if ((user.roleId === 2 || user.roleId === 4) && !user.code) {
        user.code = slug + getRandomIntInclusive(Math.pow(10, (max - slug.length)), Math.pow(10, (max - slug.length + 1)));
    }

    bcrypt.hash(user.password, 10, function (err, hash) {
        if (err) {
            return next(err);
        }
        user.password = hash;
        next();
    })
});

let User = mongoose.model('User', UserSchema);

module.exports = User;