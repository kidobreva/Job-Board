const express = require('express');
const router = express.Router();
const sha1 = require('sha1');

// Email validation
function validateEmail(email) {
    const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(String(email).toLowerCase());
}

// Login POST
router.post('/api/login', function(req, res) {
    console.log('Login Post:', req.body);

    req.db
        .get('users')
        .findOne({
            email: req.body.email,
            password: sha1(req.body.password)
        })
        .then(function(user) {
            if (user) {
                if (!user.isBlocked) {
                    console.log('User logged in:', user);
                    //delete user.password;
                    req.session.user = user;
                    req.session.save();
                    res.json(user);
                } else {
                    console.log('This user is blocked!');
                }
            } else {
                console.log('User not found or bad password!');
            }
        })
        .catch(function(err) {
            console.log(err);
        });
});

// Logout GET
router.get('/api/logout', function(req, res) {
    if (!req.session.user) {
        res.sendStatus(401);
    } else {
        req.session.destroy(function(err) {
            if (err) {
                res.sendStatus(500);
                res.json({ err: err });
            } else {
                res.sendStatus(200);
            }
        });
    }
});

// Register POST
router.post('/api/register', function(req, res) {
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
                                req.body.notifications = [];
                            } else {
                                req.body.favourites = [];
                                req.body.applied = [];
                                req.body.cv = [];
                                req.body.registeredDate = Date.now();
                            }

                            // get users and register
                            usersCollection.find().then(function(array) {
                                req.body.id = array.length || 1;

                                // for security
                                delete req.body.repeatPassword;
                                req.body.password = sha1(req.body.password);

                                // Register successful
                                usersCollection.insert(req.body).then(function(user) {
                                    console.log('New user has registered:', user);
                                    //delete req.body.password;

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
