const Tour = require('../../models/tour.model');
const User = require("../../models/user.model");
const Hotel = require("../../models/hotel.model");
const ejsHelpers = require("../../helpers/ejs-helpers");

exports.index = function (req, res, next) {
    User.findById(req.session.userid).exec(function (error, user) {
        if (error) {
            return next(error);
        } else {
            if (user === null) {
                return res.redirect('/admin/login');
            } else {
                Tour.find().exec(function (err, tours) {
                    res.render('admin/tour/index', {tours: tours, userLogin: user});
                });
            }
        }
    });
};

exports.create = function (req, res, next) {
    User.findById(req.session.userid).exec(function (error, user) {
        if (error) {
            return next(error);
        } else {
            if (user === null) {
                return res.redirect('/admin/login');
            } else {
                res.render('admin/tour/create', {
                    userLogin: user,
                    createBankFirst: req.flash('createBankFirst'),
                    validateFormError: req.flash('validateFormError')
                });
            }
        }
    });
};

exports.createPost = function (req, res, next) {
    User.findById(req.session.userid).exec(function (error, user) {
        if (error) {
            return next(error);
        } else {
            if (user === null) {
                return res.redirect('/admin/login');
            } else {
                if (req.body.title && req.body.from_id && req.body.to_id && req.body.departure_date && req.body.surcharge && req.body.link && req.body.commission) {
                    let price_detail = [];

                    let data = req.body.price_detail;

                    for (let i = 0; i < data.age_type.length; i++) {
                        price_detail.push({
                            to: parseInt(data.to[i]),
                            from: parseInt(data.from[i]),
                            age_type: parseInt(data.age_type[i]),
                            price_lunar: parseInt(data.price_lunar[i]),
                            price_normal: parseInt(data.price_normal[i]),
                            price_weekend: parseInt(data.price_weekend[i])
                        });
                    }

                    let tour = new Tour({
                        createdBy: user._id,
                        link: req.body.link,
                        title: req.body.title,
                        price_detail: price_detail,
                        surcharge: req.body.surcharge,
                        commission: req.body.commission,
                        departure_date: req.body.departure_date,
                        from_id: req.body.from_id,
                        to_id: req.body.to_id
                    });

                    tour.save(function (err) {
                        if (err) return console.error(err);

                        return res.redirect('/admin/tour/index');
                    });
                } else {
                    req.flash('validateFormError', 'Vui lòng điền đẩy đủ các thông tin có dấu (*)');

                    res.redirect('/admin/tour/create');
                }
            }
        }
    });
};

exports.update = function (req, res, next) {
    User.findById(req.session.userid).exec(function (error, user) {
        if (error) {
            return next(error);
        } else {
            if (user === null) {
                return res.redirect('/admin/login');
            } else {
                Tour.findById(req.params.id, function (err, tour) {
                    if (err) return next(err);

                    res.render('admin/tour/update', {tour: tour, userLogin: user});
                })
            }
        }
    });
};

exports.view = function (req, res, next) {
    User.findById(req.session.userid).exec(function (err, user) {
        if (err) {
            return next(err);
        } else {
            if (user === null) {
                return res.redirect('/admin/login');
            } else {
                Tour.findById(req.params.id).exec(function (err, tour) {
                    if (err) return next(err);

                    res.render('admin/tour/view', {
                        tour: tour,
                        _: ejsHelpers,
                        userLogin: user
                    });
                })
            }
        }
    });
};

exports.updatePost = function (req, res, next) {
    User.findById(req.session.userid).exec(function (error, user) {
        if (error) {
            return next(error);
        } else {
            if (user === null) {
                return res.redirect('/admin/login');
            } else {
                Tour.findById(req.params.id, function (err, tour) {
                    if (err) return next(err);

                    let price_detail = [];

                    let data = req.body.price_detail;

                    for (let i = 0; i < data.age_type.length; i++) {
                        price_detail.push({
                            to: parseInt(data.to[i]),
                            from: parseInt(data.from[i]),
                            age_type: parseInt(data.age_type[i]),
                            price_lunar: parseInt(data.price_lunar[i]),
                            price_normal: parseInt(data.price_normal[i]),
                            price_weekend: parseInt(data.price_weekend[i])
                        });
                    }

                    let queries = {
                        link: req.body.link,
                        title: req.body.title,
                        price_detail: price_detail,
                        surcharge: req.body.surcharge,
                        commission: req.body.commission,
                        departure_date: req.body.departure_date,
                        from_id: req.body.from_id,
                        to_id: req.body.to_id
                    }

                    Tour.updateOne({_id: tour.id}, {$set: queries}, function (err) {
                        if (err) return console.error(err);

                        return res.redirect('/admin/tour/index');
                    });
                });
            }
        }
    });
};