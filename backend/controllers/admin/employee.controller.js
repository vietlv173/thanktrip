const User = require('../../models/user.model');

exports.index = function (req, res, next) {
    User.findById(req.session.userid).exec(function (error, user) {
        if (error) {
            return next(error);
        } else {
            if (user === null) {
                return res.redirect('/admin/login');
            } else {
                User.find({roleId: 4}).exec(function (err, employees) {
                    res.render('admin/employee/index', {employees: employees,userLogin: user});
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
                res.render('admin/employee/create',{userLogin: user});
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
                if (req.body.username && req.body.fullName) {
                    let employee = new User({
                        fullName: req.body.fullName,
                        username: req.body.username,
                        phone: req.body.username,
                        password: req.body.username,
                        address: req.body.address,
                        note: req.body.note,
                        roleId: 4,
                        status: 10
                    });

                    employee.save(function (err) {
                        if (err) return console.error(err);

                        return res.redirect('/admin/employee/index');
                    });
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
                User.findById(req.params.id, function (err, employee) {
                    if (err) return next(err);

                    res.render('admin/employee/update', {employee: employee,userLogin: user});
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
                User.findById(req.params.id, function (err, employee) {
                    if (err) return next(err);

                    employee.note = req.body.note;
                    employee.address = req.body.address;
                    employee.fullName = req.body.fullName;

                    employee.update(function (err) {
                        if (err) return console.error(err);

                        return res.redirect('/admin/employee/index');
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
                User.findById(req.params.id).populate('customers').exec( function (err, employee) {
                    if (err) return next(err);

                    res.render('admin/employee/view', {employee: employee,userLogin: user});
                })
            }
        }
    });
};

exports.changePassword = function (req, res, next) {
    User.findById(req.session.userid).exec(function (error, user) {
        if (error) {
            return next(error);
        } else {
            if (user === null) {
                return res.redirect('/admin/login');
            } else {
                User.findById(req.params.id, function (err, employee) {
                    if (err) return next(err);

                    res.render('admin/employee/change-password', {employee: employee});
                })
            }
        }
    });
};

exports.changePasswordPost = function (req, res, next) {
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

                        return res.redirect('/admin/collaborator/view/'+req.params.id);
                    });
                });
            }
        }
    });
};

exports.deActive = function (req, res, next) {
    User.findById(req.session.userid).exec(function (error, user) {
        if (error) {
            return next(error);
        } else {
            if (user === null) {
                return res.redirect('/admin/login');
            } else {
                User.findById(req.params.id, function (err, employee) {
                    if (err) return next(err);

                    employee.status = employee.status === 10 ? 0 : 10;

                    employee.update(function (err) {
                        if (err) return console.error(err);

                        return res.redirect('/admin/employee/view/'+req.params.id);
                    });
                });
            }
        }
    });
};