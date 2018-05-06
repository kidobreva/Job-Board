var express = require('express');
var router = express.Router();
var sha1 = require('sha1');

function isLogged(req) {
    return req.session.user;
}

function validateEmail(email) {
    var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(String(email).toLowerCase());
}

router.post('/register', function(req, res, next) {
    console.log('Register Post:', req.body);
    console.log(req.session);

    if (req.body.password !== req.body.repeatPassword) {
        console.log('The passwords are not the same!');
    } else {
        if (req.body.password.length < 6) {
            console.log('The password is too short!');
        } else {
            if (!validateEmail(req.body.email)) {
                console.log('Invalid email!');
            } else {
                req.body.isAdmin = false;
                if (req.body.isCompany) {
                    req.body.adverts = [];
                } else {
                    req.body.favourites = [];
                    req.body.applied = [];
                }
                var usersCollection = req.db.get('users');
                usersCollection
                    .findOne({ email: req.body.email })
                    .then(function(user) {
                        if (!user) {
                            usersCollection.find().then(function(array) {
                                req.body.id = array.length || 1;
                                delete req.body.repeatPassword;
                                req.body.password = sha1(req.body.password);
                                usersCollection
                                    .insert(req.body)
                                    .then(function(user) {
                                        console.log(
                                            'New user has registered:',
                                            user
                                        );
                                        delete req.body.password;
                                        req.session.user = user;
                                        req.session.save();
                                        // res.sendStatus(200);
                                        res.json(user);
                                    });
                            });
                        } else {
                            console.log('The with this email already exists!');
                        }
                    })
                    .catch(function(err) {
                        console.log(err);
                    });
            }
        }
    }
});

module.exports = router;
