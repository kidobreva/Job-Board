// Modules
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const fs = require('fs');
const monk = require('monk');
const db = monk('localhost:27017/database');
const session = require('express-session');
const bodyParser = require('body-parser');
const sha1 = require('sha1');
const favicon = require('serve-favicon');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(bodyParser.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(
    session({
        secret: 'ITTalents',
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 30 // 30 days
        }
    })
);
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// database middleware
app.use(function(req, res, next) {
    req.db = db;
    next();
});
db.then(() => {
    console.log('Database connected to the server!');
});

// routes
fs.readdirSync(path.join(__dirname, 'routes')).forEach(file => {
    app.use(require('./routes/' + path.basename(file, '.js')));
});

// Register admin
const users = db.get('users');
users.findOne({ id: 0 }).then(function(user) {
    if (!user) {
        users.insert({
            id: 0,
            isAdmin: true,
            email: 'admin@jobboard.bg',
            password: sha1('admin1'),
            messages: []
        });
    }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;