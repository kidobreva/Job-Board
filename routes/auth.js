const express = require('express');
const router = express.Router();
const sha1 = require('sha1');

// Email validation
function validateEmail(email) {
    const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(String(email).toLowerCase());
}

// Logout
router.get('/api/logout', (req, res) => {
    if (!req.session.user) {
        res.sendStatus(401);
    } else {
        req.session.destroy(err => {
            res.clearCookie('connect.sid');
            res.sendStatus(err ? 500 : 200);
        });
    }
});

// Login
router.post('/api/login', (req, res) => {
    console.log('Login Post:', req.body);
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
                        res.sendStatus(403);
                        console.log('This user is blocked!');
                    }
                } else {
                    res.sendStatus(404);
                    console.log('User not found or bad password!');
                }
            });
    }
});

// Register
router.post('/api/register', (req, res) => {
    console.log(req.body);
    if (
        req.session.user ||
        req.body.password !== req.body.repeatPassword ||
        req.body.password.length < 6 ||
        !validateEmail(req.body.email)
    ) {
        res.sendStatus(400);
    } else {
        // get users and check for existing email
        const users = req.db.get('users');
        users.findOne({ email: req.body.email }).then(user => {
            if (user) {
                res.sendStatus(409);
            } else {
                users.count().then(len => {
                    // before register
                    user = {
                        id: len++
                    };
                    if (req.body.isCompany) {
                        user.role = 'COMPANY';
                        user.title = req.body.title;
                        user.bulstat = req.body.bulstat;
                        user.adverts = [];
                        user.messages = [];
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
        });
    }
});

module.exports = router;
