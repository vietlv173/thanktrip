const multer = require('multer')
const moment = require("moment/moment");

const User = require('../../models/user.model');
const Transaction = require('../../models/transaction.model');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads/transactions')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '.png')
    }
})

const upload = multer({storage: storage}).single('image');

exports.index = function (req, res, next) {
    User.findById(req.session.userid).exec(function (error, user) {
        if (error) {
            return next(error);
        } else {
            if (user === null) {
                return res.redirect('/admin/login');
            } else {
                let gte = null;
                let lte = null;

                switch (req.params.filterDate) {
                    case "today":
                        gte = moment().set({'hour': 7, 'minute': 0, 'second': 0}).toDate();

                        lte = moment().set({'hour': 30, 'minute': 59, 'second': 59}).toDate();

                        break;
                    case "yesterday":
                        gte = moment().set({
                            'day': moment().day() - 1,
                            'hour': 7,
                            'minute': 0,
                            'second': 0
                        }).toDate();

                        lte = moment().set({
                            'day': moment().day() - 1,
                            'hour': 30,
                            'minute': 59,
                            'second': 59
                        }).toDate();

                        break;
                    case "seven-day-ago":
                        gte = moment().set({
                            'day': moment().day() - 7,
                            'hour': 7,
                            'minute': 0,
                            'second': 0
                        }).toDate();

                        lte = moment().set({
                            'day': moment().day() - 1,
                            'hour': 30,
                            'minute': 59,
                            'second': 59
                        }).toDate();

                        break;
                    case "month":
                        gte = moment().startOf('month').set({'hour': 7}).toDate();

                        lte = moment().set({
                            'day': moment().day(),
                            'hour': 30,
                            'minute': 59,
                            'second': 59
                        }).toDate();

                        break;
                    case "last-month":
                        gte = moment().subtract(1, 'months').startOf('month').set({'hour': 7}).toDate();

                        lte = moment().subtract(1, 'months').endOf('month').set({
                            'hour': 30,
                            'minute': 59,
                            'second': 59
                        }).toDate();

                        break;
                    default:
                        gte = moment().startOf('month').set({'hour': 7}).toDate();

                        lte = moment().set({
                            'day': moment().day(),
                            'hour': 30,
                            'minute': 59,
                            'second': 59
                        }).toDate();

                        break;
                }

                let data = {
                    waiting: 0,
                    success: 0,
                    transactions: [],
                    wallet: user.wallet
                };

                Transaction.find({
                    "createdAt": {
                        "$gte": new Date(gte),
                        "$lte": new Date(lte)
                    },
                    user: user
                }).populate('bank').exec(function (err, transactions) {
                    data.transactions = transactions;

                    for (let i = 0; i < transactions.length; i++) {
                        let tran = transactions[i];

                        if (tran.status === 1) {
                            data.waiting += tran.amount;
                        }

                        if (tran.status === 4) {
                            data.success += tran.amount;
                        }
                    }

                    res.json(data);
                });
            }
        }
    });
};

exports.updateStatus = function (req, res, next) {
    User.findById(req.session.userid).exec(function (error, user) {
        if (error) {
            return next(error);
        } else {
            if (user === null || user.roleId !== 1) {
                res.json({
                    status: false
                });
            } else {
                Transaction.findById(req.params.id, function (err, tran) {
                    if (err) return next(err)

                    if (tran.status !== 4) {
                        upload(req, res, function (err) {
                            let path = null;

                            if (!err) {
                                path = '/uploads/transactions/' + req.file.filename;
                            }

                            let status = parseInt(req.params.status);

                            if (status === 4) {
                                updateStatus(tran._id, req, res, status, path, '');
                            } else if (status === 1 || status === 2 || status === 3) {
                                updateStatus(tran._id, req, res, req.params.status, path, '');
                            } else {
                                res.json({
                                    status: false
                                });
                            }
                        })
                    } else {
                        res.json({
                            status: false
                        });
                    }
                });
            }
        }
    });
};

function updateStatus(id, req, res, status, path, note = '') {
    Transaction.updateOne({_id: id}, {
        $set: {
            note: note,
            image: path,
            status: status,
            updatedAt: new Date(moment().set({'hour': moment().hour() + 7}).toDate())
        }
    }, function (err) {
        if (err) return console.error(err);

        res.json({
            status: true
        });
    });
}