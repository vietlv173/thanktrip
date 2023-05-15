const moment = require('moment');

const User = require('../../models/user.model');
const Hotel = require('../../models/hotel.model');

exports.index = async function (req, res, next) {
    User.findById(req.session.userid).exec(function (error, user) {
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

                if (parseInt(query.searchDateAdvanced)) {
                    conditions.createdAt = {"$gte": new Date(query.startDate), "$lte": new Date(query.endDate)};
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

                        if (query.dateQuick !== "all") {
                            conditions.createdAt = {"$gte": new Date(gte), "$lte": new Date(lte)};
                        }
                    }
                }

                const resPerPage = 15;
                const page = req.query.page || 1;

                Hotel.find(conditions).skip((resPerPage * page) - resPerPage).limit(resPerPage).populate('createdBy', 'fullName username').exec(function (err, hotels) {
                    if (err) return next(err);

                    Hotel.count(conditions).exec(function (err, numOfFlights) {
                        if (err) return next(err);

                        res.json({
                            hotels: hotels,
                            currentPage: page,
                            numOfFlights: numOfFlights,
                            pages: Math.ceil(numOfFlights / resPerPage)
                        });
                    });
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
                Hotel.findById(req.body.id, function (err, hotel) {
                    if (err) return next(err);

                    Hotel.updateOne({_id: hotel._id}, {$set: {status: req.body.status}}, function (err) {
                        if (err) return console.error(err);

                        res.json({
                            status: true
                        });
                    });
                });
            }
        }
    });
};