const User = require('../../models/user.model');

exports.dashboard = function (req, res, next) {
    User.findById(req.session.userid).populate('customers').exec(function (error, user) {
        if (error) {
            return next(error);
        } else {
            if (user === null) {
                return res.redirect('/admin/login');
            } else {
                res.render('admin/dashboard/' + (user.roleId === 1 ? 'index-admin' : 'index-collaborator'), {userLogin: user});
            }
        }
    });
};

exports.login = function (req, res) {
    res.render('admin/dashboard/login');
};

exports.loginPost = function (req, res) {
    if (req.body.username && req.body.password) {
        User.authenticate(req.body.username, req.body.password, function (error, user) {
            if (error || !user) {
                res.render('admin/dashboard/login', {error: 'Sai tên đăng nhập hoặc mật khẩu!'});
            } else {
                req.session.userid = user._id;

                return res.redirect('/admin/dashboard');
            }
        });
    } else {
        res.render('admin/dashboard/login', {error: 'Vui lòng nhập tên đăng nhập và mật khẩu!'});
    }
};

exports.register = function (req, res) {
    res.render('admin/dashboard/register');
};

exports.registerPost = function (req, res) {
    if (req.body.username && req.body.password && req.body.fullName && req.body.password && req.body.re_password) {
        let collaborator = new User({
            fullName: req.body.fullName,
            username: req.body.username,
            phone: req.body.username,
            password: req.body.password,
            roleId: 2,
            status: 10
        });

        User.findOne({code: req.body.code}).exec(function (err, parent) {
            if (parent) {
                collaborator.parent = parent;
            }

            collaborator.save(function (err) {
                if (err) return console.error(err);

                User.authenticate(req.body.username, req.body.password, function (error, user) {
                    req.session.userid = user._id;

                    return res.redirect('/admin/dashboard');
                });
            });
        });
    } else {
        res.render('admin/dashboard/register', {error: 'Vui lòng điền đẩy đủ các thông tin có dấu (*)'});
    }
};

exports.logout = function (req, res, next) {
    if (req.session) {
        req.session.destroy(function (err) {
            if (err) {
                return next(err);
            } else {
                return res.redirect('/admin/login');
            }
        });
    }
};