let createError = require('http-errors');

let express = require('express');

let app = express();

let path = require('path');
let logger = require('morgan');
let flash = require('req-flash');
let cookieParser = require('cookie-parser');

const mongoose = require('mongoose');

let session = require('express-session');
let MongoStore = require('connect-mongo')(session);

mongoose.connect('mongodb://127.0.0.1:27017/thinkflight', {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
});

let db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {

});

const User = require('./models/user.model');

User.find({username: 'admin@thinkflight.com'}, function (err, results) {
    if (!results.length) {
        let userNew = new User({
            fullName: 'Admin',
            username: 'admin@thinkflight.com',
            password: '123456',
            roleId: 1,
            status: 10
        });

        userNew.save(function (err) {
            if (err) return console.error(err);
        });
    }
});

app.use(session({
    secret: 'work hard',
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
        mongooseConnection: db
    })
}));

app.use(flash());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


let bankRouter = require('./routes/admin/bank.route');

let userRouter = require('./routes/admin/user.route');

let flightRouter = require('./routes/admin/flight.route');

let employeeRouter = require('./routes/admin/employee.route');

let dashboardRouter = require('./routes/admin/dashboard.route');

let transactionRouter = require('./routes/admin/transaction.route');

let collaboratorRouter = require('./routes/admin/collaborator.route');

/**
 * API ROUTE START
 */

let apiRouter = require('./routes/api/api.route');

app.use('/api', apiRouter);

/**
 * API ROUTE END
 */

app.use('/admin', dashboardRouter);

app.use('/admin/user', userRouter);

app.use('/admin/bank', bankRouter);

app.use('/admin/flight', flightRouter);

app.use('/admin/employee', employeeRouter);

app.use('/admin/transaction', transactionRouter);

app.use('/admin/collaborator', collaboratorRouter);

app.use(function (req, res, next) {
    next(createError(404));
});

app.use(function (err, req, res) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
