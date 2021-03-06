const express = require('express');
const router = express.Router();
const sha1 = require('sha1');

// Email validation
function validateEmail(email) {
    const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(String(email).toLowerCase());
}

// Bulstat validation
function bulstatCheck(bulstat) {
    const regex = /^[0-9]*$/gm;
    return regex.test(+bulstat) && bulstat.length === 9;
}

// Logout
router.get('/api/logout', (req, res) => {
    if (!req.session.user) {
        res.sendStatus(401);
    } else {
        // Destroy session and cookie
        req.session.destroy(err => {
            res.clearCookie('connect.sid');
            res.sendStatus(err ? 500 : 200);
        });
    }
});

// Login
router.post('/api/login', (req, res) => {
    if (req.session.user) {
        res.sendStatus(400);
    } else {
        req.db
            .get('users')
            .findOne({
                email: req.body.email,
                password: sha1(req.body.password)
            })
            .then(user => {
                if (user) {
                    if (!user.isBlocked) {
                        console.log('User logged in:', user);
                        delete user.password;
                        req.session.user = user;
                        req.session.save(() => {
                            res.json(user);
                        });
                    } else {
                        // TODO: change the status code to 403 or something else
                        res.sendStatus(404);
                        console.log('This user is blocked!');
                    }
                } else {
                    res.sendStatus(404);
                    console.log('User not found or bad password!');
                }
            });
    }
});

// Register user
function registerUser(req, res) {
    const users = req.db.get('users');
    users.count().then(len => {
        // before register
        const user = {
            id: len++
        };
        if (req.body.isCompany) {
            user.role = 'COMPANY';
            user.title = req.body.title;
            user.bulstat = req.body.bulstat;
            user.adverts = [];
            user.messages = [];
            user.pictures = [];
        } else {
            user.role = 'USER';
            user.firstName = req.body.firstName;
            user.lastName = req.body.lastName;
            user.applied = [];
            user.favourites = [];
        }
        user.email = req.body.email;

        delete req.body.isCompany;
        delete req.body.repeatPassword;
        user.registeredDate = Date.now();
        user.password = sha1(req.body.password);

        // save to database
        users.insert(user).then(user => {
            delete req.body.password;
            console.log('New user has registered:', user);
            req.session.user = user;
            req.session.save(() => {
                res.json(user);
            });
        });
    });
}

// Register
router.post('/api/register', (req, res) => {
    // Checks
    if (
        (req.body.isCompany && !bulstatCheck(req.body.bulstat)) ||
        req.session.user ||
        req.body.password !== req.body.repeatPassword ||
        req.body.password.length < 6 ||
        !validateEmail(req.body.email)
    ) {
        res.sendStatus(400);
    } else {
        const users = req.db.get('users');

        // Check for existing email
        const emailCheck = function() {
            users.findOne({ email: req.body.email }).then(user => {
                if (user) {
                    res.sendStatus(409);
                } else {
                    registerUser(req, res);
                }
            });
        };

        if (req.body.isCompany) {
            // Register company
            users.findOne({ bulstat: req.body.bulstat || 0 }).then(user => {
                if (user) {
                    res.sendStatus(400);
                } else {
                    emailCheck();
                }
            });
        } else {
            // Register user
            emailCheck();
        }
    }
});

module.exports = router;
