var express = require('express');
var router = express.Router();
var sha1 = require('sha1');

function isLogged(req) {
    return req.session.user;
}

router.post('/login', function(req, res, next) {
    console.log('Login Post:', req.body);

    req.db
        .get('users')
        .findOne({
            email: req.body.email,
            password: sha1(req.body.password)
        })
        .then(function(user) {
            if (user) {
                console.log('User logged in:', user);
                delete user.password;
                req.session.user = user;
                res.sendStatus(200);
            } else {
                console.log('User not found or bad password!')
            }
        }).catch (function (err) {
          console.log(err);
        });
});

module.exports = router;
