const User = require("../../models/user.model");
const Hotel = require('../../models/hotel.model');
const ejsHelpers = require("../../helpers/ejs-helpers");

exports.index = function (req, res, next) {
    User.findById(req.session.userid).exec(function (error, user) {
        if (error) {
            return next(error);
        } else {
            if (user === null) {
                return res.redirect('/admin/login');
            } else {
                Hotel.find().exec(function (err, tours) {
                    res.render('admin/hotel/index', {tours: tours, userLogin: user});
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
                res.render('admin/hotel/create', {
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
                if (validateBody(req.body)) {
                    let result = resultDetails(req.body);

                    let hotel = new Hotel({
                        tpe: req.body.tpe,
                        createdBy: user._id,
                        note: req.body.note,
                        title: req.body.title,
                        email: req.body.email,
                        phone: req.body.phone,
                        room_detail: result.room_detail,
                        bank_id: req.body.bank_id,
                        address: req.body.address,
                        check_in: req.body.check_in,
                        check_out: req.body.check_out,
                        surcharge: req.body.surcharge,
                        service_detail: result.service_detail,
                        commission: req.body.commission,
                        province_id: req.body.province_id,
                        child_policy: req.body.child_policy,
                        free_service: req.body.free_service,
                        accountNumber: req.body.accountNumber,
                        accountHolder: req.body.accountHolder,
                        refund_policy: req.body.refund_policy,
                        room_included: req.body.room_included,
                    });

                    hotel.save(function (err) {
                        if (err) return console.error(err);

                        return res.redirect('/admin/hotel/view/' + hotel.id);
                    });
                } else {
                    req.flash('validateFormError', 'Vui lòng điền đẩy đủ các thông tin có dấu (*)');

                    res.redirect('/admin/hotel/create');
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
                User.findById(req.params.id, function (err, collaborator) {
                    if (err) return next(err);

                    res.render('admin/hotel/update', {collaborator: collaborator, userLogin: user});
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
                User.findById(req.params.id, function (err, collaborator) {
                    if (err) return next(err);

                    collaborator.note = req.body.note;
                    collaborator.address = req.body.address;
                    collaborator.fullName = req.body.fullName;

                    collaborator.update(function (err) {
                        if (err) return console.error(err);

                        return res.redirect('/admin/hotel/index');
                    });
                });
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
                Hotel.findById(req.params.id).exec(function (err, hotel) {
                    if (err) return next(err);

                    res.render('admin/hotel/view', {
                        hotel: hotel,
                        _: ejsHelpers,
                        userLogin: user
                    });
                })
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
                Hotel.findById(req.params.id, function (err, hotel) {
                    if (err) return next(err);

                    res.render('admin/hotel/update', {hotel: hotel, userLogin: user});
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
                if (validateBody(req.body)) {
                    Hotel.findById(req.params.id, function (err, hotel) {
                        if (err) return next(err);

                        let result = resultDetails(req.body);

                        let queries = {
                            tpe: req.body.tpe,
                            note: req.body.note,
                            title: req.body.title,
                            email: req.body.email,
                            phone: req.body.phone,
                            room_detail: result.room_detail,
                            bank_id: req.body.bank_id,
                            address: req.body.address,
                            check_in: req.body.check_in,
                            check_out: req.body.check_out,
                            surcharge: req.body.surcharge,
                            service_detail: result.service_detail,
                            commission: req.body.commission,
                            province_id: req.body.province_id,
                            child_policy: req.body.child_policy,
                            free_service: req.body.free_service,
                            accountNumber: req.body.accountNumber,
                            accountHolder: req.body.accountHolder,
                            refund_policy: req.body.refund_policy,
                            room_included: req.body.room_included,
                        };

                        Hotel.updateOne({_id: hotel.id}, {$set: queries}, function (err) {
                            if (err) return console.error(err);

                            return res.redirect('/admin/hotel/view/' + req.params.id);
                        });
                    });
                } else {
                    req.flash('validateFormError', 'Vui lòng điền đẩy đủ các thông tin có dấu (*)');

                    res.redirect('/admin/hotel/update/' + hotel);
                }
            }
        }
    });
};

function resultDetails(body) {
    let room_detail = [];

    let data = body.room_detail;

    for (let i = 0; i < data.room_type.length; i++) {
        let id = 'id' in data ? parseInt(data.id[i]) : i + 1;
        if (i === 0) {
            room_detail.push({
                id: id,
                to: data.to[i],
                from: data.from[i],
                room_type: data.room_type[i],
                bed_type: parseInt(data.bed_type[i]),
                price_lunar: parseInt(data.price_lunar[i]),
                price_normal: parseInt(data.price_normal[i]),
                price_weekend: parseInt(data.price_weekend[i])
            });
        } else {
            room_detail.push({
                id: id,
                room_type: data.room_type[i],
                bed_type: parseInt(data.bed_type[i]),
                price_lunar: parseInt(data.price_lunar[i]),
                price_normal: parseInt(data.price_normal[i]),
                price_weekend: parseInt(data.price_weekend[i])
            });
        }
    }

    let service_detail = [];

    if ('service_detail' in body) {
        let data2 = body.service_detail;

        for (let i = 0; i < data2.length; i++) {
            service_detail.push({
                title: data2[i].title,
                price: parseInt(data2[i].price)
            });
        }
    }

    return {room_detail, service_detail};
}

function validateBody(body) {
    let fieldRequires = ['title', 'phone', 'email', 'tpe', 'province_id', 'address', 'check_in', 'check_out', 'refund_policy', 'commission', 'surcharge', 'room_included'];

    for (let i = 0; i < fieldRequires.length; i++) {
        let field = fieldRequires[i];
        if (!(field in body) || !body[field]) {
            console.log(field);
            return false;
        }
    }

    return true;
}