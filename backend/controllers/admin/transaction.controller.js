const User = require('../../models/user.model');

const Transaction = require('../../models/transaction.model');

const ejsHelpers = require('../../helpers/ejs-helpers');

exports.index = function (req, res, next) {
    User.findById(req.session.userid).exec(function (error, user) {
        if (error) {
            return next(error);
        } else {
            if (user === null) {
                return res.redirect('/admin/login');
            } else {

                let query = user.roleId === 1 ? {}:{user:user.id};

                Transaction.find(query).populate('user').populate('bank').exec(function (err, transactions) {
                    res.render('admin/transaction/index', {_ : ejsHelpers,transactions: transactions,userLogin:user});
                });
            }
        }
    });
};

exports.create = function (req, res, next) {
    User.findById(req.session.userid).populate('banks').exec(function (error, user) {
        if (error) {
            return next(error);
        } else {
            if (user === null) {
                return res.redirect('/admin/login');
            } else {
                if(user.roleId === 1){
                    return res.redirect('/admin/dashboard');
                }

                if(!user.banks.length){
                    req.flash('createBankFirst', 'Vui lòng thêm tài khoản ngân hàng trước khi thực hiện rút tiền!');

                    res.redirect('/admin/bank/create');

                }

                res.render('admin/transaction/create', {userLogin: user,notEnoughMoney: req.flash('notEnoughMoney'),validateFormError: req.flash('validateFormError')});
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
                if(user.roleId === 1){
                    return res.redirect('/admin/dashboard');
                }

                if (req.body.bankId && req.body.amount > 0) {
                    if(req.body.amount <= user.wallet){
                        let transaction = new Transaction({
                            user:user._id,
                            bank:req.body.bankId,
                            amount:req.body.amount
                        });


                        transaction.save(function (err) {
                            if (err) return console.error(err);

                            user.transactions.push(transaction);
                            user.save();

                            return res.redirect('/admin/transaction/index');
                        });
                    }
                    else{
                        req.flash('notEnoughMoney', 'Bạn rút số tiền ₫<strong>'+ejsHelpers.formatNumber(req.body.amount)+'</strong> vượt quá số dư cho phép ₫<strong>'+ejsHelpers.formatNumber(user.wallet)+'</strong>');

                        res.redirect('/admin/transaction/create');
                    }

                }
                else{
                    req.flash('validateFormError', 'Vui lòng nhập số tiền bạn muốn rút!');

                    res.redirect('/admin/transaction/create');
                }
            }
        }
    });
};