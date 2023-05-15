const moment = require('moment');

const User = require('../../models/user.model');
const Order = require('../../models/order.model');

function queryOrders(query, conditions, req, res, next) {
    if (parseInt(query.searchDateAdvanced)) {
        conditions.createdAt = {
            "$gte": new Date(query.startDate),
            "$lte": new Date(query.endDate)
        };
    } else {
        if (query.dateQuick) {
            let gte = null;
            let lte = null;

            switch (query.dateQuick) {
                case "today":
                    gte = moment().set({'hour': 7, 'minute': 0, 'second': 0}).toDate();

                    lte = moment().set({'hour': 30, 'minute': 59, 'second': 59}).toDate();

                    break;
                case "yesterday":
                    gte = moment().set({
                        'day': moment().day() - 1, 'hour': 7, 'minute': 0, 'second': 0
                    }).toDate();

                    lte = moment().set({
                        'day': moment().day() - 1, 'hour': 30, 'minute': 59, 'second': 59
                    }).toDate();

                    break;
                case "seven-day-ago":
                    gte = moment().set({
                        'day': moment().day() - 7, 'hour': 7, 'minute': 0, 'second': 0
                    }).toDate();

                    lte = moment().set({
                        'day': moment().day() - 1, 'hour': 30, 'minute': 59, 'second': 59
                    }).toDate();

                    break;
                case "month":
                    gte = moment().startOf('month').set({'hour': 7}).toDate();

                    lte = moment().set({
                        'day': moment().day(), 'hour': 30, 'minute': 59, 'second': 59
                    }).toDate();

                    break;
                case "last-month":
                    gte = moment().subtract(1, 'months').startOf('month').set({'hour': 7}).toDate();

                    lte = moment().subtract(1, 'months').endOf('month').set({
                        'hour': 30, 'minute': 59, 'second': 59
                    }).toDate();

                    break;
                default:
                    break;
            }

            if (query.dateQuick !== "all") {
                conditions.createdAt = {"$gte": new Date(gte), "$lte": new Date(lte)};
            }
        }
    }

    const resPerPage = 15;
    const page = req.query.page || 1;

    Order.find(conditions).skip((resPerPage * page) - resPerPage).limit(resPerPage).populate('user').exec(function (err, orders) {
        if (err) return next(err);

        Order.count(conditions).exec(function (err, numOfOrders) {
            if (err) return next(err);

            res.json({
                orders: orders,
                currentPage: page,
                numOfOrders: numOfOrders,
                pages: Math.ceil(numOfOrders / resPerPage)
            });
        });
    });
}

exports.index = async function (req, res, next) {
    await User.findById(req.session.userid).exec(function (error, user) {
        if (error) {
            return next(error);
        } else {
            if (user === null) {
                return res.redirect('/admin/login');
            } else {

                let conditions = {};

                let query = req.query;

                if (query.id) {
                    conditions._id = query.id;
                }

                if (query.status > 0) {
                    conditions.status = query.status;
                }

                if (user.roleId === 2) {
                    if (query.child === 'false') {
                        conditions.user = [user];

                        queryOrders(query, conditions, req, res, next);
                    } else {
                        let users = [];

                        User.find({roleId: 2, parent: user.id}).exec(function (err, child1) {
                            if (err) return next(err);

                            for (let i = 0; i < child1.length; i++) {
                                users.push(child1[i]);
                            }

                            conditions.user = users;

                            User.find({id: users}).exec(function (err, child2) {
                                if (err) return next(err);

                                for (let i = 0; i < child2.length; i++) {
                                    users.push(child2[i]);
                                }

                                conditions.user = users;

                                queryOrders(query, conditions, req, res, next);
                            });
                        });
                    }
                } else {
                    queryOrders(query, conditions, req, res, next);
                }
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
                Order.findById(req.body.id).populate('user').exec(function (err, order) {
                    if (err) return next(err);

                    Order.updateOne({_id: order._id}, {$set: {status: req.body.status}}, function (err) {
                        if (err) return console.error(err);

                        if (req.body.status === 3) {
                            updateCommissionRef(order.commission, order.user);
                        }

                        res.json({
                            status: true
                        });
                    });
                });
            }
        }
    });
};

function updateCommission(commission, user) {
    User.updateOne({_id: user._id}, {$set: {wallet: user.wallet + commission}}, function (err) {
        if (err) return next(err);
    });
}

function updateCommissionRef(commission, user) {
    updateCommission(commission * 70 / 100, user);

    if (!user.parent) return;

    User.findOne({roleId: 2, _id: user.parent._id}).exec(function (err, parent1) {
        if (err) return next(err);

        if (!parent1) return;

        updateCommission(commission * 20 / 100, parent1);

        if (!parent1.parent) return;

        User.find({_id: parent1.parent._id}).exec(function (err, parent2) {
            if (err) return next(err);

            if (parent2) {
                updateCommission(commission * 10 / 100, parent2);
            }
        });
    });
}