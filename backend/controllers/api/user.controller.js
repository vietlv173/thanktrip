const moment = require('moment');

const User = require('../../models/user.model');

exports.index = async function (req, res, next) {
    User.findById(req.session.userid).exec(function (error, user) {
        if (error) {
            return next(error);
        } else {
            if (user === null) {
                return res.redirect('/admin/login');
            } else {

                let conditions = {roleId: 3};

                let query = req.query;

                if(query.userSearch){
                    conditions.phone = new RegExp('.*'+query.userSearch+'.*', "i")
                }

                if(query.status > 0){
                    conditions.status = query.status;
                }

                if(parseInt(query.searchDateAdvanced)){
                    conditions.createdAt = {"$gte": new Date(query.startDate), "$lte": new Date(query.endDate)};
                }
                else{
                    if(query.dateQuick){
                        let gte = null;
                        let lte = null;

                        switch (query.dateQuick) {
                            case "today":
                                gte = moment().set({'hour': 7, 'minute': 0,'second':0}).toDate();

                                lte = moment().set({'hour': 30, 'minute': 59,'second':59}).toDate();

                                break;
                            case "yesterday":
                                gte = moment().set({'day':moment().day()-1,'hour': 7, 'minute': 0,'second':0}).toDate();

                                lte = moment().set({'day':moment().day()-1,'hour': 30, 'minute': 59,'second':59}).toDate();

                                break;
                            case "seven-day-ago":
                                gte = moment().set({'day':moment().day()-7,'hour': 7, 'minute': 0,'second':0}).toDate();

                                lte = moment().set({'day':moment().day()-1,'hour': 30, 'minute': 59,'second':59}).toDate();

                                break;
                            case "month":
                                gte = moment().startOf('month').set({'hour': 7}).toDate();

                                lte = moment().set({'day':moment().day(),'hour': 30, 'minute': 59,'second':59}).toDate();

                                break;
                            case "last-month":
                                gte = moment().subtract(1,'months').startOf('month').set({'hour': 7}).toDate();

                                lte = moment().subtract(1,'months').endOf('month').set({'hour': 30, 'minute': 59,'second':59}).toDate();

                                break;
                            default:
                                break;
                        }

                        if(query.dateQuick !== "all"){
                            conditions.createdAt = {"$gte": new Date(gte), "$lte": new Date(lte)};
                        }
                    }
                }

                const resPerPage = 15;
                const page = req.query.page || 1;

                User.find(conditions).skip((resPerPage * page) - resPerPage).limit(resPerPage).exec(function (err, users) {
                    if (err) return next(err);

                    User.count(conditions).exec(function (err, numOfUsers) {
                        if (err) return next(err);

                        res.json({
                            users: users,
                            currentPage: page,
                            numOfUsers: numOfUsers,
                            pages: Math.ceil(numOfUsers / resPerPage)
                        });
                    });
                });
            }
        }
    });
};