const express = require('express');
const router = express.Router();
const sha1 = require('sha1');
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const mime = require('mime');

// Get Profile
router.get('/api/profile', (req, res) => {
    // Check for user in session
    if (!req.session.user) {
        res.sendStatus(401);
    } else {
        const fields = {
            password: 0,
            _id: 0
        };
        // Find user in database
        req.db
            .get('users')
            .findOne({ id: req.session.user.id }, { fields })
            .then(user => {
                if (user) {
                    // TODO: Send less data
                    res.json(user);
                } else {
                    // If the user is not in the database, destroy his session
                    req.session.destroy(err => {
                        res.clearCookie('connect.sid');
                        res.sendStatus(err ? 500 : 410);
                    });
                }
            });
    }
});

// Get "Edit Profile" data
router.get('/api/edit-profile', (req, res) => {
    // Check for user in session
    if (!req.session.user) {
        res.sendStatus(401);
    } else {
        // Find user in database
        req.db
            .get('users')
            .findOne({ id: req.session.user.id })
            .then(user => {
                // Destroy session if the user is not in the database
                if (!user) {
                    req.session.destroy(err => {
                        res.clearCookie('connect.sid');
                        res.sendStatus(err ? 500 : 410);
                    });
                } else {
                    // Send profile data
                    switch (user.role) {
                        case 'USER':
                            user = {
                                role: user.role,
                                firstName: user.firstName,
                                lastName: user.lastName
                            };
                            break;
                        case 'COMPANY':
                            user = {
                                title: user.title,
                                role: user.role,
                                description: user.description,
                                contacts: user.contacts
                            };
                            break;
                    }
                    res.json(user);
                }
            });
    }
});

// Update Profile
router.post('/api/profile/edit', (req, res) => {
    // Check for user in session
    if (!req.session.user) {
        res.sendStatus(401);
    } else {
        const users = req.db.get('users');
        users.findOne({ id: req.session.user.id }).then(user => {
            if (!user) {
                // If the user is not in the database, destroy his session
                req.session.destroy(err => {
                    res.clearCookie('connect.sid');
                    res.sendStatus(err ? 500 : 410);
                });
            } else {
                // Check the password
                if (sha1(req.body.currentPass) !== user.password) {
                    res.sendStatus(401);
                } else {
                    // get the updated props
                    for (var prop in user) {
                        if (user[prop] !== req.body[prop]) {
                            user[prop] = req.body[prop];
                        }
                    }
                    for (var prop in req.body) {
                        if (!(prop in user)) {
                            user[prop] = req.body[prop];
                        }
                    }
                    // take only the needed props
                    switch (user.role) {
                        case 'USER':
                            user = {
                                $set: {
                                    firstName: user.firstName,
                                    lastName: user.lastName
                                }
                            };
                            break;
                        case 'COMPANY':
                            user = {
                                $set: {
                                    title: user.title,
                                    description: user.description,
                                    contacts: user.contacts
                                }
                            };
                            break;
                    }
                    if (req.body.newPassword) {
                        user.$set.password = sha1(req.body.newPassword);
                    }

                    // update database
                    users.findOneAndUpdate({ id: req.session.user.id }, user).then(() => {
                        res.sendStatus(200);
                    });
                }
            }
        });
    }
});

/* UPLOADS */

// Upload profile picture or company logo
router.post('/api/profile/upload-picture/:id', (req, res) => {
    // Check for user in session
    if (!req.session.user) {
        res.sendStatus(401);
    } else {
        const users = req.db.get('users');
        users.findOne({ id: req.session.user.id }).then(user => {
            if (!user) {
                // If the user is not in the database, destroy his session
                req.session.destroy(err => {
                    res.clearCookie('connect.sid');
                    res.sendStatus(err ? 500 : 410);
                });
            } else {
                let name;
                const storage = multer.diskStorage({
                    destination: function(req, file, cb) {
                        // Create folder for the user
                        const dir = path.join('public', 'uploads', req.session.user.id.toString());
                        if (!fs.existsSync(path.join('public', 'uploads'))) {
                            fs.mkdirSync(path.join('public', 'uploads'));
                        }
                        if (!fs.existsSync(dir)) {
                            fs.mkdirSync(dir);
                        }
                        cb(null, path.join('public', 'uploads', req.session.user.id.toString()));
                    },
                    filename: function(req, file, cb) {
                        name = 'profile.' + mime.getExtension(file.mimetype);
                        cb(null, name);
                    }
                });
                const upload = multer({ storage }).single('file');
                upload(req, res, function(err) {
                    if (err) {
                        res.sendStatus(400);
                    } else {
                        // update database
                        const img = `uploads/${req.session.user.id}/${name}`;
                        // save to database and send url path to the user
                        users
                            .findOneAndUpdate({ id: req.session.user.id }, { $set: { img } })
                            .then(user => {
                                if (user.role === 'COMPANY') {
                                    req.db
                                        .get('adverts')
                                        .update(
                                            { companyId: user.id },
                                            { $set: { img } },
                                            { multi: true }
                                        )
                                        .then(() => {
                                            res.json({ img });
                                        });
                                }
                            });
                    }
                });
            }
        });
    }
});

// Upload pictures for the company's gallery
router.post('/api/profile/upload-pictures/:id', (req, res) => {
    // Check for the current user's role
    if (!req.session.user || req.session.user.role !== 'COMPANY') {
        res.sendStatus(401);
    } else {
        const users = req.db.get('users');
        users.findOne({ id: req.session.user.id }).then(user => {
            if (!user) {
                // If the user is not in the database, destroy his session
                req.session.destroy(err => {
                    res.clearCookie('connect.sid');
                    res.sendStatus(err ? 500 : 410);
                });
            } else {
                let name;
                const storage = multer.diskStorage({
                    destination: function(req, file, cb) {
                        // Create folder for the user
                        const dir = path.join('public', 'uploads', req.session.user.id.toString());
                        if (!fs.existsSync(path.join('public', 'uploads'))) {
                            fs.mkdirSync(path.join('public', 'uploads'));
                        }
                        if (!fs.existsSync(dir)) {
                            fs.mkdirSync(dir);
                        }
                        cb(null, path.join('public', 'uploads', req.session.user.id.toString()));
                    },
                    filename: function(req, file, cb) {
                        name =
                            (++user.pictures.length || 1) + '.' + mime.getExtension(file.mimetype);
                        cb(null, name);
                    }
                });
                const upload = multer({ storage }).single('file');
                upload(req, res, function(err) {
                    if (err) {
                        res.sendStatus(400);
                    } else {
                        // update database
                        const picture = `uploads/${req.session.user.id}/${name}`;
                        users
                            .findOneAndUpdate(
                                { id: req.session.user.id },
                                { $push: { pictures: picture } }
                            )
                            .then(user => {
                                res.json({ pictures: user.pictures });
                            });
                    }
                });
            }
        });
    }
});

// Delete pictures
router.patch('/api/profile/pictures', (req, res) => {
    // Check for the current user's role
    if (!req.session.user || req.session.user.role !== 'COMPANY') {
        res.sendStatus(401);
    } else {
        const users = req.db.get('users');
        users.findOne({ id: req.session.user.id }).then(user => {
            if (!user) {
                // If the user is not in the database, destroy his session
                req.session.destroy(err => {
                    res.clearCookie('connect.sid');
                    res.sendStatus(err ? 500 : 410);
                });
            } else {
                // update database
                users
                    .findOneAndUpdate(
                        { id: req.session.user.id },
                        { $pull: { pictures: req.body.url } }
                    )
                    .then(() => {
                        res.sendStatus(200);
                    });
            }
        });
    }
});

// Delete video
router.delete('/api/profile/video', (req, res) => {
    // Check for the current user's role
    if (!req.session.user || req.session.user.role !== 'COMPANY') {
        res.sendStatus(401);
    } else {
        const users = req.db.get('users');
        users.findOne({ id: req.session.user.id }).then(user => {
            if (!user) {
                // If the user is not in the database, destroy his session
                req.session.destroy(err => {
                    res.clearCookie('connect.sid');
                    res.sendStatus(err ? 500 : 410);
                });
            } else {
                // update database
                users
                    .findOneAndUpdate({ id: req.session.user.id }, { $unset: { video: '' } })
                    .then(() => {
                        res.sendStatus(200);
                    });
            }
        });
    }
});

// Upload CV
router.post('/api/profile/upload-cv/:id', (req, res) => {
    // Check for the current user's role
    if (!req.session.user || req.session.user.role !== 'USER') {
        res.sendStatus(401);
    } else {
        const users = req.db.get('users');
        users.findOne({ id: req.session.user.id }).then(user => {
            if (!user) {
                // If the user is not in the database, destroy his session
                req.session.destroy(err => {
                    res.clearCookie('connect.sid');
                    res.sendStatus(err ? 500 : 410);
                });
            } else {
                let name;
                const storage = multer.diskStorage({
                    destination: function(req, file, cb) {
                        // Create folder for the user
                        const dir = path.join('public', 'uploads', req.session.user.id.toString());
                        if (!fs.existsSync(path.join('public', 'uploads'))) {
                            fs.mkdirSync(path.join('public', 'uploads'));
                        }
                        if (!fs.existsSync(dir)) {
                            fs.mkdirSync(dir);
                        }
                        cb(null, path.join('public', 'uploads', req.session.user.id.toString()));
                    },
                    filename: function(req, file, cb) {
                        name = 'cv.' + mime.getExtension(file.mimetype);
                        cb(null, name);
                    }
                });
                const upload = multer({ storage }).single('file');
                upload(req, res, function(err) {
                    if (err) {
                        res.sendStatus(400);
                    } else {
                        // save to database and send url path to the user
                        const cv = `uploads/${req.session.user.id}/${name}`;
                        users
                            .findOneAndUpdate({ id: req.session.user.id }, { $set: { cv } })
                            .then(() => {
                                res.json({ cv });
                            });
                    }
                });
            }
        });
    }
});

// Upload video
router.post('/api/profile/upload-video/:id', (req, res) => {
    // Check for the current user's role
    if (!req.session.user || req.session.user.role !== 'COMPANY') {
        res.sendStatus(401);
    } else {
        const users = req.db.get('users');
        users.findOne({ id: req.session.user.id }).then(user => {
            if (!user) {
                // If the user is not in the database, destroy his session
                req.session.destroy(err => {
                    res.clearCookie('connect.sid');
                    res.sendStatus(err ? 500 : 410);
                });
            } else {
                let name;
                const storage = multer.diskStorage({
                    destination: function(req, file, cb) {
                        // Create folder for the user
                        const dir = path.join('public', 'uploads', req.session.user.id.toString());
                        if (!fs.existsSync(path.join('public', 'uploads'))) {
                            fs.mkdirSync(path.join('public', 'uploads'));
                        }
                        if (!fs.existsSync(dir)) {
                            fs.mkdirSync(dir);
                        }
                        cb(null, path.join('public', 'uploads', req.session.user.id.toString()));
                    },
                    filename: function(req, file, cb) {
                        name = 'video.' + mime.getExtension(file.mimetype);
                        cb(null, name);
                    }
                });
                const upload = multer({ storage }).single('file');
                upload(req, res, function(err) {
                    if (err) {
                        res.sendStatus(400);
                    } else {
                        // save to database and send url path to the user
                        const video = `uploads/${req.session.user.id}/${name}`;
                        users
                            .findOneAndUpdate({ id: req.session.user.id }, { $set: { video } })
                            .then(() => {
                                res.json({ video });
                            });
                    }
                });
            }
        });
    }
});

module.exports = router;
