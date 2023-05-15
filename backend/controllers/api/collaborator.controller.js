const moment = require('moment');

const User = require('../../models/user.model');
const Order = require('../../models/order.model');
const Transaction = require('../../models/transaction.model');

exports.index = function (req, res, next) {
    User.findById(req.session.userid).exec(function (error, user) {
        if (error) {
            return next(error);
        } else {
            if (user === null) {
                return res.redirect('/admin/login');
            } else {
                let id = req.params.id;

                if (user.roleId === 2) {
                    id = req.session.userid;
                }

                User.findById(id).exec(function (err, collaborator) {
                    if (err) return next(err);

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
                            break;
                    }

                    let data = {
                        revenue: 0,
                        commission: 0,
                        transactions: [],
                        wallet: collaborator.wallet
                    };

                    let conditions = {};

                    let users = [collaborator];

                    User.find({roleId: 2, parent: collaborator.id}).exec(function (err, child1) {
                        if (err) return next(err);

                        data.child1 = child1;

                        for (let i = 0; i < child1.length; i++) {
                            users.push(child1[i]);
                        }

                        conditions.user = users;

                        User.find({id: users}).exec(function (err, child2) {
                            if (err) return next(err);

                            data.child2 = child2;

                            for (let i = 0; i < child2.length; i++) {
                                users.push(child2[i]);
                            }

                            conditions.user = users;

                            Order.find({user: collaborator}).exec(function (err, orders) {
                                if (err) return next(err);

                                for (let i = 0; i < orders.length; i++) {
                                    if (orders[i].status === 2) {
                                        data.commission += orders[i].commission * 70 / 100;
                                    }

                                    if (orders[i].status === 2 || orders[i].status === 3) {
                                        data.revenue += orders[i].revenue;
                                    }
                                }

                                Transaction.find({
                                    "createdAt": {
                                        "$gte": new Date(gte),
                                        "$lte": new Date(lte)
                                    },
                                    user: collaborator
                                }).populate('bank').exec(function (err, transactions) {

                                    data.transactions = transactions;

                                    res.json(data);
                                });
                            });
                        });
                    });
                });
            }
        }
    });
};