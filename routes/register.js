var express = require('express');
var router = express.Router();
var sha1 = require('sha1');

function isLogged(req) {
    return req.session.user;
}

// Email validation
function validateEmail(email) {
    var regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(String(email).toLowerCase());
}

// Register POST
router.post('/register', function(req, res) {
    console.log('Register Post:', req.body);
    console.log(req.session);

    // Parity
    if (req.body.password !== req.body.repeatPassword) {
        console.log('The passwords are not the same!');
    } else {
        // Length
        if (req.body.password.length < 6) {
            console.log('The password is too short!');
        } else {
            // Email validation
            if (!validateEmail(req.body.email)) {
                console.log('Invalid email!');
            } else {
                // get users
                var usersCollection = req.db.get('users');
                usersCollection
                    .findOne({ email: req.body.email })
                    .then(function(user) {
                        if (!user) {
                            // before register
                            req.body.isAdmin = false;
                            if (req.body.isCompany) {
                                req.body.adverts = [];
                            } else {
                                req.body.favourites = [];
                                req.body.applied = [];
                                req.body.registeredDate = Date.now();
                            }

                            // get users and register
                            usersCollection.find().then(function(array) {
                                req.body.id = array.length || 1;

                                // for security
                                delete req.body.repeatPassword;
                                req.body.password = sha1(req.body.password);

                                // Register successful
                                usersCollection
                                    .insert(req.body)
                                    .then(function(user) {
                                        console.log(
                                            'New user has registered:',
                                            user
                                        );
                                        delete req.body.password;

                                        // save to session
                                        req.session.user = user;
                                        req.session.save();

                                        // response
                                        res.json(user);
                                        // res.sendStatus(200);
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
