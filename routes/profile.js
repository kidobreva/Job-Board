const express = require('express');
const router = express.Router();
const sha1 = require('sha1');
const fs = require('fs');

// (GET) Profile
router.get('/api/profile', function(req, res) {
    if (req.session.user) {
        res.json(req.session.user);
    } else {
        res.sendStatus(401);
    }
});

// (POST) Upload picture
router.post('/api/profile/upload-picture/:id', function(req, res) {
    console.log('Profile Post:', req.body.data);
    if (!req.session.user) {
        res.sendStatus(401);
    } else {
        const users = req.db.get('users');
        users
            .findOne({ id: req.session.user.id })
            .then(function(user) {
                if (user) {
                    const img = req.body.data;
                    // save to session
                    req.session.user.img = img;
                    req.session.save();

                    // save to database
                    user.img = img;
                    users.findOneAndUpdate({ id: req.session.user.id }, user).then(function() {
                        res.json({ img: img });
                    });
                } else {
                    console.log('No user!');
                }
            })
            .catch(function(err) {
                console.log(err);
            });
    }
});

// Profile edit
router.post('/api/profile/edit', function(req, res) {
    console.log('Profile Post:', req.body);
<<<<<<< HEAD

    const users = req.db.get('users');
    users
        .findOne({ id: req.session.user.id })
        .then(function(user) {
            if (user) {
                //if (req.body.currentPass === req.body.newPassword) {
                //    res.sendStatus(400);
                //} else {
=======
    if (!req.session.user) {
        res.sendStatus(401);
    } else {
        const users = req.db.get('users');
        users
            .findOne({ id: req.session.user.id })
            .then(function(user) {
                if (user) {
>>>>>>> 6b0d8c9f594afc4ec8b0374e1c5dc97fc4ffda2f
                    if (sha1(req.body.currentPass) !== req.session.user.password) {
                        res.sendStatus(401);
                    } else {
                        // edit
                        if (req.body.newPassword) {
                            user.password = sha1(req.body.newPassword);
                            delete req.body.newPassword;
                            delete req.body.repeatNewPassword;
                            delete req.body.currentPass;
                        }
                        for (var prop in user) {
                            if (user[prop] !== req.body[prop]) {
                                user[prop] = req.body[prop];
                            }
                        }

                        // save to session
                        req.session.user = user;
                        req.session.save();

                        // save to database
<<<<<<< HEAD
                        users
                            .findOneAndUpdate({ id: req.session.user.id }, user)
                            .then(function() {
                                res.json(user);
                            });
                    }
                //}    
            } else {
                console.log('No user!');
            }
        })
        .catch(function(err) {
            console.log(err);
        });
=======
                        users.findOneAndUpdate({ id: req.session.user.id }, user).then(function() {
                            res.json(user);
                        });
                    }
                } else {
                    console.log('No user!');
                }
            })
            .catch(function(err) {
                console.log(err);
            });
    }
>>>>>>> 6b0d8c9f594afc4ec8b0374e1c5dc97fc4ffda2f
});

// Upload CV POST
router.post('/api/profile/upload-cv/:id', function(req, res) {
    console.log('CV Post:', req.body.data);
    if (!req.session.user && (req.session.user.isCompany || req.session.user.isAdmin)) {
        res.sendStatus(401);
    } else {
        const users = req.db.get('users');
        users
            .findOne({ id: req.session.user.id })
            .then(function(user) {
                if (user) {
                    req.body.data = req.body.data.replace('data:application/pdf;base64,', '');
                    // Create folder for user
                    const dir = `public/uploads/${req.session.user.id.toString()}/`;
                    if (!fs.existsSync('public/uploads')) {
                        fs.mkdirSync('public/uploads');
                    }
                    if (!fs.existsSync(dir)) {
                        fs.mkdirSync(dir);
                    }
                    fs.writeFile(
                        dir + `cv${user.cv.length + 1}.pdf`,
                        req.body.data,
                        'base64',
                        err => {
                            if (err) {
                                console.log(err);
                            }
                            console.log('File saved!');
                        }
                    );

                    const cv = `uploads/${req.session.user.id.toString()}/cv${user.cv.length +
                        1}.pdf`;
                    // save to session
                    req.session.user.cv.push(cv);
                    req.session.save();

                    // save to database
                    user.cv.push(cv);
                    users.findOneAndUpdate({ id: req.session.user.id }, user).then(function() {
                        res.json({ cv: cv });
                    });
                } else {
                    console.log('No user!');
                }
            })
            .catch(function(err) {
                console.log(err);
            });
    }
});

module.exports = router;
