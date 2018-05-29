// require
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const fs = require('fs');
const monk = require('monk');
const db = monk('localhost:27017/database');
const session = require('express-session');

const app = express();

// use
app.use(logger('dev'));
app.use(express.json({ limit: '100mb' }));
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

// database middleware
app.use((req, res, next) => {
    req.db = db;
    next();
});
db.then(() => {
    console.log('Database connected to the server!');    
});

// API routes
fs.readdirSync(path.join(__dirname, 'routes')).forEach(file => {
    app.use(require(`./routes/${path.basename(file, '.js')}`));
});

// For using HTML5Mode in AngularJS
app.all('/*', (req, res) => {
    res.sendFile('public/index.html', { root: __dirname });
});

module.exports = app;
