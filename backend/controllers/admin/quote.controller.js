require('dotenv').config();

const domain = process.env.DOMAIN;

const puppeteer = require("puppeteer");

const User = require("../../models/user.model");
const Quote = require('../../models/quote.model');
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
                res.render('admin/quote/index', {userLogin: user});
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
                res.render('admin/quote/create', {
                    userLogin: user
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
                Quote.count({}).exec(function (err, count) {
                    if (err) return next(err);

                    const result = resultDetails(req.body);

                    let quote = new Quote({
                        details: result,
                        quote_id: count + 1,
                        createdBy: req.session.userid
                    });

                    quote.save(async function (err) {
                        if (err) return console.error(err);

                        await (async () => {
                            const browser = await puppeteer.launch({
                                // executablePath: '/usr/bin/chromium-browser',
                                headless: true,
                                args: ['--no-sandbox']
                            });

                            const page = await browser.newPage();
                            await page.goto(domain + '/admin/quote/public/' + quote._id, {waitUntil: 'networkidle2'});
                            await page.pdf({
                                path: './public/uploads/quotes/' + quote._id + '.pdf',
                                format: 'A4',
                                printBackground: true,
                            });

                            await browser.close();
                        })();

                        return res.redirect('/admin/quote/view/' + quote._id);
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
                Quote.findById(req.params.id).exec(function (err, quote) {
                    if (err) return next(err);

                    res.render('admin/quote/view', {
                        quote: quote,
                        _: ejsHelpers,
                        userLogin: user
                    });
                })
            }
        }
    });
};

exports.public = function (req, res, next) {
    Quote.findById(req.params.id).exec(function (err, quote) {
        if (err) return next(err);

        let ids = [];

        for (let i = 0; i < quote.details.length; i++) {
            ids.push(quote.details[i].hotel_id);
        }

        Hotel.find({_id: ids}).exec(function (err, hotels) {
            if (err) return next(err);

            for (let i = 0; i < quote.details.length; i++) {
                for (let j = 0; j < hotels.length; j++) {
                    if (hotels[j]._id.toString() === quote.details[i].hotel_id) {
                        quote.details[i].hotel = hotels[j];

                        break;
                    }
                }
            }

            res.render('admin/quote/public', {
                quote: quote,
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
                Quote.findById(req.params.id, function (err, quote) {
                    if (err) return next(err);

                    if (quote.createdBy.toString() === req.session.userid) {
                        return res.render('admin/quote/update', {quote: quote, userLogin: user});
                    }
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
                Quote.findById(req.params.id, function (err, quote) {
                    if (err) return next(err);

                    const result = resultDetails(req.body);

                    let queries = {
                        details: result
                    };

                    Quote.updateOne({_id: quote.id}, {$set: queries}, function (err) {
                        if (err) return console.error(err);

                        (async () => {
                            const browser = await puppeteer.launch({
                                // executablePath: '/usr/bin/chromium-browser',
                                headless: true,
                                args: ['--no-sandbox']
                            });

                            const page = await browser.newPage();
                            await page.goto(domain + '/admin/quote/public/' + quote._id, {waitUntil: 'networkidle2'});
                            await page.pdf({
                                path: './public/uploads/quotes/' + quote._id + '.pdf',
                                format: 'A4',
                                printBackground: true,
                            });

                            await browser.close();
                        })();

                        return res.redirect('/admin/quote/view/' + quote._id);
                    });
                });
            }
        }
    });
};

function resultDetails(body) {
    let details = [];

    if ('details' in body) {

        for (let i = 0; i < body.details.length; i++) {
            let detail = {
                rooms: [],
                hotel_id: body.details[i].hotel_id
            };

            for (let j = 0; j < body.details[i].rooms.length; j++) {
                let temp = body.details[i].rooms[j];

                if ('visible' in temp) {
                    detail.rooms.push(parseInt(body.details[i].rooms[j].room_id));
                }
            }

            if (detail.rooms.length) {
                details.push(detail);
            }
        }
    }

    return details;
}