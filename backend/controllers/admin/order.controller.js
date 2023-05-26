require('dotenv').config();

const domain = process.env.DOMAIN;

const User = require("../../models/user.model");
const Order = require('../../models/order.model');
const Hotel = require("../../models/hotel.model");
const ejsHelpers = require("../../helpers/ejs-helpers");
const puppeteer = require("puppeteer");

exports.index = function (req, res, next) {
    User.findById(req.session.userid).exec(function (error, user) {
        if (error) {
            return next(error);
        } else {
            if (user === null) {
                return res.redirect('/admin/login');
            } else if (user.roleId === 1) {
                res.render('admin/order/index', {userLogin: user});
            } else {
                res.render('admin/order/index2', {userLogin: user});
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
                User.find({roleId: 2}).exec(function (err, collaborators) {
                    res.render('admin/order/create', {
                        userLogin: user,
                        collaborators: collaborators,
                        createBankFirst: req.flash('createBankFirst'),
                        validateFormError: req.flash('validateFormError')
                    });
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
                if (req.body.user_id) {
                    const result = serviceDetail(req.body.service_detail);

                    Order.count({}).exec(function (err, count) {
                        if (err) return next(err);

                        let order = new Order({
                            tpe: req.body.tpe,
                            order_id: count + 1,
                            user: req.body.user_id,
                            revenue: result.revenue,
                            commission: result.commission,
                            service_detail: result.service_detail
                        });

                        order.save(async function (err) {
                            if (err) return console.error(err);

                            await (async () => {
                                const browser = await puppeteer.launch({
                                    // executablePath: '/usr/bin/chromium-browser',
                                    headless: true,
                                    args: ['--no-sandbox']
                                });

                                const page = await browser.newPage();
                                await page.goto(domain + '/admin/order/public/' + quote._id, {waitUntil: 'networkidle2'});
                                await page.pdf({
                                    path: './public/uploads/orders/' + order._id + '.pdf',
                                    format: 'A4',
                                    printBackground: true,
                                });

                                await browser.close();
                            })();

                            return res.redirect('/admin/order/view/' + order._id);
                        });
                    });

                } else {
                    req.flash('validateFormError', 'Vui lòng điền đẩy đủ các thông tin có dấu (*)');

                    res.redirect('/admin/order/create');
                }
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
                Order.findById(req.params.id).exec(function (err, order) {
                    if (err) return next(err);

                    let ids = [];

                    for (let i = 0; i < order.service_detail.length; i++) {
                        if (order.service_detail[i].service_type === 2) {
                            ids.push(order.service_detail[i].hotel_id);
                        }
                    }

                    Hotel.find({_id: ids}).exec(function (err, hotels) {
                        if (err) return next(err);

                        for (let i = 0; i < order.service_detail.length; i++) {
                            for (let j = 0; j < hotels.length; j++) {
                                if (hotels[j]._id.toString() === order.service_detail[i].hotel_id && order.service_detail[i].service_type === 2) {
                                    order.service_detail[i].hotel = hotels[j];

                                    break;
                                }
                            }
                        }

                        res.render('admin/order/view', {
                            order: order,
                            _: ejsHelpers,
                            userLogin: user
                        });
                    });
                })
            }
        }
    });
};

exports.public = function (req, res, next) {
    Order.findById(req.params.id).exec(function (err, order) {
        if (err) return next(err);

        let ids = [];

        for (let i = 0; i < order.service_detail.length; i++) {
            if (order.service_detail[i].service_type === 2) {
                ids.push(order.service_detail[i].hotel_id);
            }
        }

        Hotel.find({_id: ids}).exec(function (err, hotels) {
            if (err) return next(err);

            for (let i = 0; i < order.service_detail.length; i++) {
                for (let j = 0; j < hotels.length; j++) {
                    if (hotels[j]._id.toString() === order.service_detail[i].hotel_id && order.service_detail[i].service_type === 2) {
                        order.service_detail[i].hotel = hotels[j];

                        break;
                    }
                }
            }

            res.render('admin/order/public', {
                order: order,
                _: ejsHelpers
            });
        });
    })
};

exports.update = function (req, res, next) {
    User.findById(req.session.userid).exec(function (error, user) {
        if (error) {
            return next(error);
        } else {
            if (user === null) {
                return res.redirect('/admin/login');
            } else {
                Order.findById(req.params.id, function (err, order) {
                    if (err) return next(err);
                    User.find({roleId: 2}).exec(function (err, collaborators) {
                        res.render('admin/order/update', {order: order, collaborators: collaborators, userLogin: user});
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
                Order.findById(req.params.id, function (err, order) {
                    if (err) return next(err);

                    const result = serviceDetail(req.body.service_detail);

                    let queries = {
                        tpe: req.body.tpe,
                        user: req.body.user_id,
                        revenue: result.revenue,
                        commission: result.commission,
                        service_detail: result.service_detail
                    };

                    Order.updateOne({_id: order.id}, {$set: queries}, async function (err) {
                        if (err) return console.error(err);

                        await (async () => {
                            const browser = await puppeteer.launch({
                                // executablePath: '/usr/bin/chromium-browser',
                                headless: true,
                                args: ['--no-sandbox']
                            });

                            const page = await browser.newPage();
                            await page.goto(domain + '/admin/order/public/' + order._id, {waitUntil: 'networkidle2'});
                            await page.pdf({
                                path: './public/uploads/orders/' + order._id + '.pdf',
                                format: 'A4',
                                printBackground: true,
                            });

                            await browser.close();
                        })();

                        return res.redirect('/admin/order/view/' + order._id);
                    });
                });
            }
        }
    });
};

function serviceDetail(service_detail) {
    let revenue = 0;
    let commission = 0;

    for (let i = 0; i < service_detail.length; i++) {
        service_detail[i].commission = parseInt(service_detail[i].commission);
        service_detail[i].service_type = parseInt(service_detail[i].service_type);

        if (service_detail[i].service_type === 1 || service_detail[i].service_type === 2) {
            service_detail[i].surcharge = parseInt(service_detail[i].surcharge);

            service_detail[i].price_type = parseInt(service_detail[i].price_type);
            for (let j = 0; j < service_detail[i].detail.length; j++) {
                let temp = service_detail[i].detail[j];
                service_detail[i].detail[j].quantity = parseInt(temp.quantity);
                service_detail[i].detail[j].price_lunar = parseInt(temp.price_lunar);
                service_detail[i].detail[j].price_normal = parseInt(temp.price_normal);
                service_detail[i].detail[j].price_weekend = parseInt(temp.price_weekend);

                let price = 0;

                let price_type = service_detail[i].price_type;

                if (price_type === 1) {
                    price = temp.price_normal;
                } else if (price_type === 2) {
                    price = temp.price_weekend;
                } else if (price_type === 3) {
                    price = temp.price_lunar;
                }

                if (temp.quantity) {
                    revenue += temp.quantity * price + service_detail[i].surcharge;

                    commission += temp.quantity * service_detail[i].commission;
                }
            }
        }

        if (service_detail[i].service_type === 2) {
            for (let j = 0; j < service_detail[i].services.length; j++) {
                let temp = service_detail[i].services[j];
                service_detail[i].services[j].price = parseInt(temp.price);
                service_detail[i].services[j].quantity = parseInt(temp.quantity);

                revenue += temp.quantity * temp.price;
            }
        }

        if (service_detail[i].service_type === 3 || service_detail[i].service_type === 4) {
            service_detail[i].price = parseInt(service_detail[i].price);
            service_detail[i].quantity = parseInt(service_detail[i].quantity);

            revenue += service_detail[i].price * service_detail[i].quantity;

            commission += service_detail[i].quantity * service_detail[i].commission;
        }
    }

    return {service_detail, revenue, commission};
}