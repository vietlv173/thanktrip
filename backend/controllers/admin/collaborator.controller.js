const ejs = require('ejs');

const nodeMailer =  require('nodemailer');

const User = require('../../models/user.model');

const ejsHelpers = require('../../helpers/ejs-helpers');

exports.index = function (req, res, next) {
    User.findById(req.session.userid).exec(function (error, user) {
        if (error) {
            return next(error);
        } else {
            if (user === null) {
                return res.redirect('/admin/login');
            } else {
                User.find({roleId: 2}).exec(function (err, collaborators) {
                    res.render('admin/collaborator/index', {collaborators: collaborators,userLogin: user});
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
                res.render('admin/collaborator/create', {userLogin: user});
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
            } else if (req.body.username && req.body.fullName) {

                let collaborator = new User({
                    fullName: req.body.fullName,
                    username: req.body.username,
                    phone: req.body.username,
                    password: req.body.username,
                    email: req.body.email,
                    address: req.body.address,
                    note: req.body.note,
                    discount: req.body.discount ? req.body.discount : 0,
                    commission: req.body.commission ? req.body.commission : 0,
                    roleId: 2,
                    status: 10
                });

                let transporter = nodeMailer.createTransport({
                    host: 'smtp.gmail.com',
                    port: 465,
                    secure: true,
                    auth: {
                        user: 'levanviet_t58@hus.edu.vn',
                        pass: 'Thangngo0'
                    }
                });

                let mailOptions = {
                    to: collaborator.email,
                    subject: '[ThankTrip] Thông tin đăng nhập',
                    html: ejs.render('<table border="0" cellspacing="0" cellpadding="0" align="center" style="border-collapse:collapse">\n' +
                        '    <tbody>\n' +
                        '    <tr>\n' +
                        '        <td\n' +
                        '            style="font-family:Helvetica Neue,Helvetica,Lucida Grande,tahoma,verdana,arial,sans-serif;background:#ffffff">\n' +
                        '            <table border="0" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse">\n' +
                        '                <tbody>\n' +
                        '                <tr>\n' +
                        '                    <td height="20" style="line-height:20px" colspan="3">&nbsp;</td>\n' +
                        '                </tr>\n' +
                        '                <tr>\n' +
                        '                    <td width="15" style="display:block;width:15px">&nbsp;&nbsp;&nbsp;</td>\n' +
                        '                    <td>\n' +
                        '                        <table border="0" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse">\n' +
                        '                            <tbody>\n' +
                        '                            <tr>\n' +
                        '                                <td height="15" style="line-height:15px" colspan="3">&nbsp;</td>\n' +
                        '                            </tr>\n' +
                        '                            <tr>\n' +
                        '                                <td width="32" align="left" valign="middle" style="height:32px;line-height:0">\n' +
                        '                                    <img src="https://duybnd-1659.github.io/images/logo.png" height="45" style="border:0" class="CToWUd">\n' +
                        '                                </td>\n' +
                        '                                <td width="15" style="display:block;width:15px">&nbsp;&nbsp;&nbsp;</td>\n' +
                        '                                <td width="100%">\n' +
                        '                                    <span style="font-family:Helvetica Neue,Helvetica,Lucida Grande,tahoma,verdana,arial,sans-serif;font-size:19px;line-height:32px;color:#3b5998">ThankTrip</span>\n' +
                        '                                </td>\n' +
                        '                            </tr>\n' +
                        '                            <tr style="border-bottom:solid 1px #e5e5e5">\n' +
                        '                                <td height="15" style="line-height:15px" colspan="3">&nbsp;</td>\n' +
                        '                            </tr>\n' +
                        '                            </tbody>\n' +
                        '                        </table>\n' +
                        '                    </td>\n' +
                        '                    <td width="15" style="display:block;width:15px">&nbsp;&nbsp;&nbsp;</td>\n' +
                        '                </tr>\n' +
                        '                <tr>\n' +
                        '                    <td width="15" style="display:block;width:15px">&nbsp;&nbsp;&nbsp;</td>\n' +
                        '                    <td>\n' +
                        '                        <table border="0" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse">\n' +
                        '                            <tbody>\n' +
                        '                            <tr>\n' +
                        '                                <td height="28" style="line-height:28px">&nbsp;</td>\n' +
                        '                            </tr>\n' +
                        '                            <tr>\n' +
                        '                                <td>\n' +
                        '                                    <div style="font-family:Helvetica Neue,Helvetica,Lucida Grande,tahoma,verdana,arial,sans-serif;font-size:16px;line-height:21px;color:#141823">\n' +
                        '                                        <p>Xin chào ' + collaborator.fullName + ',</p>\n' +
                        '                                        <p></p>\n' +
                        '                                        <div>\n' +
                        '                                            Chúng tôi đã nhận được yêu cầu làm CTV cùng ThankTrip của bạn.\n' +
                        '                                        </div>\n' +
                        '                                        <br>\n' +
                        '                                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-image: linear-gradient(140deg, #ffa311 0%, #ff4500 100%);color: #fff;box-shadow: 0 3px 6px rgba(255, 167, 0, 0.4);">\n' +
                        '                                            <tbody>\n' +
                        '                                            <tr>\n' +
                        '                                                <td style="text-transform:uppercase;padding:12px 10px">Thông tin đăng nhập vào trang quản trị của bạn là:</td>\n' +
                        '                                            </tr>\n' +
                        '                                            </tbody>\n' +
                        '                                        </table>\n' +
                        '                                        <table width="100%" cellpadding="0" cellspacing="0" border="0">\n' +
                        '                                            <tbody>\n' +
                        '                                            <tr>\n' +
                        '                                                <td style="font-size:11px;font-family:LucidaGrande,tahoma,verdana,arial,sans-serif;padding:10px;background-color:#f2f2f2;border-left:1px solid #ccc;border-right:1px solid #ccc;border-top:1px solid #ccc;border-bottom:1px solid #ccc">\n' +
                        '                                                    <span style="font-family:Helvetica Neue,Helvetica,Lucida Grande,tahoma,verdana,arial,sans-serif;font-size:16px;line-height:21px;color:#141823">\n' +
                        '                                                        Link đăng nhập\n' +
                        '                                                    </span>\n' +
                        '                                                </td>\n' +
                        '                                                <td style="font-size:11px;font-family:LucidaGrande,tahoma,verdana,arial,sans-serif;padding:10px;background-color:#f2f2f2;border-left:1px solid #ccc;border-right:1px solid #ccc;border-top:1px solid #ccc;border-bottom:1px solid #ccc">\n' +
                        '                                                    <span style="font-family:Helvetica Neue,Helvetica,Lucida Grande,tahoma,verdana,arial,sans-serif;font-size:16px;line-height:21px;color:#141823">\n' +
                        '                                                        <a href="http://150.95.108.243:9000/admin/login">\n' +
                        '                                                            http://150.95.108.243:9000\n' +
                        '                                                        </a>\n' +
                        '                                                    </span>\n' +
                        '                                                </td>\n' +
                        '                                            </tr>\n' +
                        '                                            <tr>\n' +
                        '                                                <td style="font-size:11px;font-family:LucidaGrande,tahoma,verdana,arial,sans-serif;padding:10px;background-color:#f2f2f2;border-left:1px solid #ccc;border-right:1px solid #ccc;border-top:1px solid #ccc;border-bottom:1px solid #ccc">\n' +
                        '                                                    <span style="font-family:Helvetica Neue,Helvetica,Lucida Grande,tahoma,verdana,arial,sans-serif;font-size:16px;line-height:21px;color:#141823">\n' +
                        '                                                        Tài khoản\n' +
                        '                                                    </span>\n' +
                        '                                                </td>\n' +
                        '                                                <td style="font-size:11px;font-family:LucidaGrande,tahoma,verdana,arial,sans-serif;padding:10px;background-color:#f2f2f2;border-left:1px solid #ccc;border-right:1px solid #ccc;border-top:1px solid #ccc;border-bottom:1px solid #ccc">\n' +
                        '                                                    <span style="font-family:Helvetica Neue,Helvetica,Lucida Grande,tahoma,verdana,arial,sans-serif;font-size:16px;line-height:21px;color:#141823">\n' +
                        '                                                        ' + collaborator.phone + '\n' +
                        '                                                    </span>\n' +
                        '                                                </td>\n' +
                        '                                            </tr>\n' +
                        '                                            <tr>\n' +
                        '                                                <td style="font-size:11px;font-family:LucidaGrande,tahoma,verdana,arial,sans-serif;padding:10px;background-color:#f2f2f2;border-left:1px solid #ccc;border-right:1px solid #ccc;border-top:1px solid #ccc;border-bottom:1px solid #ccc">\n' +
                        '                                                    <span style="font-family:Helvetica Neue,Helvetica,Lucida Grande,tahoma,verdana,arial,sans-serif;font-size:16px;line-height:21px;color:#141823">\n' +
                        '                                                        Mật khẩu\n' +
                        '                                                    </span>\n' +
                        '                                                </td>\n' +
                        '                                                <td style="font-size:11px;font-family:LucidaGrande,tahoma,verdana,arial,sans-serif;padding:10px;background-color:#f2f2f2;border-left:1px solid #ccc;border-right:1px solid #ccc;border-top:1px solid #ccc;border-bottom:1px solid #ccc">\n' +
                        '                                                    <span style="font-family:Helvetica Neue,Helvetica,Lucida Grande,tahoma,verdana,arial,sans-serif;font-size:16px;line-height:21px;color:#141823">\n' +
                        '                                                        ' + collaborator.phone + '\n' +
                        '                                                    </span>\n' +
                        '                                                </td>\n' +
                        '                                            </tr>\n' +
                        '                                            </tbody>\n' +
                        '                                        </table>\n' +
                        '                                        <p></p>\n' +
                        '                                        Ngoài ra, bạn có thể đăng nhập trực tiếp tại đây.\n' +
                        '                                        <table border="0" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse"><tbody>\n' +
                        '                                            <tr>\n' +
                        '                                                <td height="9" style="line-height:9px" colspan="3">&nbsp;</td>\n' +
                        '                                            </tr>\n' +
                        '                                            <tr>\n' +
                        '                                                <td>\n' +
                        '                                                    <a href="" style="color:#3b5998;text-decoration:none" target="_blank">\n' +
                        '                                                        <table border="0" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse">\n' +
                        '                                                            <tbody>\n' +
                        '                                                            <tr>\n' +
                        '                                                                <td style="border-collapse:collapse;border-radius:2px;text-align:center;display:block;padding:12px 16px 12px 16px;background-image: linear-gradient(140deg, #ffa311 0%, #ff4500 100%);color: #fff;box-shadow: 0 3px 6px rgba(255, 167, 0, 0.4);">\n' +
                        '                                                                    <a href="http://150.95.108.243:9000/admin/login" style="color:#3b5998;text-decoration:none;display:block" target="_blank">\n' +
                        '                                                                        <center>\n' +
                        '                                                                            <font size="3">\n' +
                        '                                                                                <span style="font-family:Helvetica Neue,Helvetica,Lucida Grande,tahoma,verdana,arial,sans-serif;white-space:nowrap;font-weight:bold;vertical-align:middle;color:#ffffff;font-size:14px;line-height:14px">\n' +
                        '                                                                                    Đăng nhập ngay\n' +
                        '                                                                                </span>\n' +
                        '                                                                            </font>\n' +
                        '                                                                        </center>\n' +
                        '                                                                    </a>\n' +
                        '                                                                </td>\n' +
                        '                                                            </tr>\n' +
                        '                                                            </tbody>\n' +
                        '                                                        </table>\n' +
                        '                                                    </a>\n' +
                        '                                                </td>\n' +
                        '                                                <td width="100%"></td>\n' +
                        '                                            </tr>\n' +
                        '                                            <tr>\n' +
                        '                                                <td height="32" style="line-height:32px" colspan="3">&nbsp;</td>\n' +
                        '                                            </tr>\n' +
                        '                                            </tbody>\n' +
                        '                                        </table>\n' +
                        '                                        <br>\n' +
                        '                                        <div>\n' +
                        '                                            <span style="color:#333333;font-weight:bold">\n' +
                        '                                                Bạn đã không yêu cầu thông tin này?\n' +
                        '                                            </span>\n' +
                        '                                        </div>\n' +
                        '                                        Nếu bạn không yêu cầu làm CTV, hay bỏ qua email này.\n' +
                        '                                    </div>\n' +
                        '                                </td>\n' +
                        '                            </tr>\n' +
                        '                            <tr>\n' +
                        '                                <td height="28" style="line-height:28px">&nbsp;</td>\n' +
                        '                            </tr>\n' +
                        '                            </tbody>\n' +
                        '                        </table>\n' +
                        '                    </td>\n' +
                        '                    <td width="15" style="display:block;width:15px">&nbsp;&nbsp;&nbsp;</td>\n' +
                        '                </tr>\n' +
                        '                <tr>\n' +
                        '                    <td width="15" style="display:block;width:15px">&nbsp;&nbsp;&nbsp;</td>\n' +
                        '                    <td>\n' +
                        '                        <table border="0" width="100%" cellspacing="0" cellpadding="0" align="left"\n' +
                        '                               style="border-collapse:collapse">\n' +
                        '                            <tbody>\n' +
                        '                            <tr style="border-top:solid 1px #e5e5e5">\n' +
                        '                                <td height="19" style="line-height:19px">&nbsp;</td>\n' +
                        '                            </tr>\n' +
                        '                            <tr>\n' +
                        '                                <td style="font-family:Helvetica Neue,Helvetica,Lucida Grande,tahoma,verdana,arial,sans-serif;font-size:11px;color:#aaaaaa;line-height:16px">\n' +
                        '                                    Tin nhắn này được gửi tới\n' +
                        '                                    <a href="mailto:l'+collaborator.email+'" style="color:#3b5998;text-decoration:none" target="_blank">\n' +
                        '                                        '+collaborator.email+ '\n' +
                        '                                    </a>\n' +
                        '                                    theo yêu chính sách của ThinkTrip.\n' +
                        '                                    <br>\n' +
                        '                                    <div>\n' +
                        '                                        <a href="#">ThankTrip</a>\n' +
                        '                                        <span>© 2020 creativeLabs.</span>\n' +
                        '                                    </div>\n' +
                        '                                </td>\n' +
                        '                            </tr>\n' +
                        '                            </tbody>\n' +
                        '                        </table>\n' +
                        '                    </td>\n' +
                        '                    <td width="15" style="display:block;width:15px">&nbsp;&nbsp;&nbsp;</td>\n' +
                        '                </tr>\n' +
                        '                <tr>\n' +
                        '                    <td height="20" style="line-height:20px" colspan="3">&nbsp;</td>\n' +
                        '                </tr>\n' +
                        '                </tbody>\n' +
                        '            </table>\n' +
                        '        </td>\n' +
                        '    </tr>\n' +
                        '    </tbody>\n' +
                        '</table>', user)
                };

                transporter.sendMail(mailOptions, (err) => {
                    if (err) return console.error(err);
                });

                collaborator.save(function (err) {
                    if (err) return console.error(err);

                    let random = Math.floor(Math.random() * 10);

                    let user = new User({
                        fullName: req.body.fullName + ' KH',
                        username: req.body.username + random,
                        phone: req.body.username + random,
                        password: req.body.username + random,
                        address: req.body.address,
                        note: req.body.note,
                        roleId: 3,
                        status: 10
                    });

                    user.save(function (err) {
                        if (err) return console.error(err);
                    });

                    return res.redirect('/admin/collaborator/index');
                });
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

                    res.render('admin/collaborator/update', {collaborator: collaborator,userLogin: user});
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
                let queries = {
                    note:req.body.note,
                    address:req.body.address,
                    fullName:req.body.fullName,
                    discount:req.body.discount ? req.body.discount : 0,
                    commission:req.body.commission ? req.body.commission : 0
                };

                User.updateOne({_id: req.params.id}, {$set: queries},function (err) {
                    if (err) return console.error(err);

                    return res.redirect('/admin/collaborator/view/'+req.params.id);
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
                User.findById(req.params.id).populate('customers').populate('banks').populate('transactions').exec( function (err, collaborator) {
                    if (err) return next(err);

                    res.render('admin/collaborator/view', {_ : ejsHelpers, collaborator: collaborator,userLogin: user,changePasswordSuccess: req.flash('changePasswordSuccess')});
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
                User.findById(req.params.id, function (err, collaborator) {
                    if (err) return next(err);

                    res.render('admin/collaborator/change-password', {collaborator: collaborator,userLogin: user,validateFormError: req.flash('validateFormError')});
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
                if (req.body.password && req.body.rePassword) {

                    if(req.body.password.length < 6){
                        req.flash('validateFormError', 'Vui lòng nhập mật khẩu tối thiểu 6 kí tự!');

                        res.redirect('/admin/collaborator/change-password/'+req.params.id);
                    }

                    if(req.body.password !== req.body.rePassword){
                        req.flash('validateFormError', 'Mật khẩu không giống nhau!');

                        res.redirect('/admin/collaborator/change-password/'+req.params.id);
                    }

                    User.updateOne({_id: req.params.id}, {$set:{ password: req.body.password }},function (err) {
                        if (err) return console.error(err);

                        req.flash('changePasswordSuccess', 'Đổi mật khẩu thành công!');

                        return res.redirect('/admin/collaborator/view/'+req.params.id);
                    });
                }
                else{
                    req.flash('validateFormError', 'Vui lòng nhập đầy đủ thông tin có dấu (*)!');

                    res.redirect('/admin/collaborator/change-password/'+req.params.id);
                }
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
                if(user.roleId !== 1){
                    return res.redirect('/admin/dashboard');
                }

                User.findById(req.params.id, function (err, user) {
                    if (err) return next(err);

                    User.updateOne({_id:user._id}, {$set:{ status: (user.status === 10 ? 0 : 10) }},function (err) {
                        if (err) return console.error(err);

                        return res.redirect('/admin/collaborator/view/'+req.params.id);
                    });
                });
            }
        }
    });
};