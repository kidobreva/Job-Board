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
        // Find user in database
        req.db
            .get('users')
            .findOne({ id: req.session.user.id })
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
                let img = req.body.img;

                // Create folder for the user
                const dir = path.join('public', 'uploads', req.session.user.id.toString());
                if (!fs.existsSync(path.join('public', 'uploads'))) {
                    fs.mkdirSync(path.join('public', 'uploads'));
                }
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir);
                }
                // Decode the file and write it to the file system
                // TODO: Use multer instead of doing it manually
                let ext = req.body.name.split('.');
                ext = ext[ext.length - 1];
                if (img.slice(0, 10) === 'data:image') {
                    fs.writeFile(
                        path.join(dir, `profile.${ext}`),
                        Buffer.from(img.slice(22), 'base64'),
                        err => {
                            console.log(err ? err : 'File saved!');
                        }
                    );
                }
                img = `uploads/${req.session.user.id}/profile.${ext}`;

                // save to database and send url path to the user
                users.findOneAndUpdate({ id: req.session.user.id }, { $set: { img } }).then(() => {
                    res.json({ img });
                });
            }
        });
    }
});

// Upload pictures for the company's gallery
router.post('/api/profile/upload-pictures/:id', (req, res) => {
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
                        const picture = path.join('uploads', req.session.user.id.toString(), name);
                        users
                            .findOneAndUpdate(
                                { id: req.session.user.id },
                                { $push: { pictures: picture } }
                            )
                            .then(() => {
                                res.sendStatus(200);
                            });
                    }
                });
            }
        });
    }
});

// Upload CV
router.post('/api/profile/upload-cv/:id', (req, res) => {
    // Check for user in session
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
                // Create folder for the user
                const dir = path.join('public', 'uploads', req.session.user.id.toString());
                if (!fs.existsSync(path.join('public', 'uploads'))) {
                    fs.mkdirSync(path.join('public', 'uploads'));
                }
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir);
                }
                // Decode the file and write it to the file system
                // TODO: Use multer instead of doing it manually
                req.body.data = req.body.data.replace('data:application/pdf;base64,', '');
                fs.writeFile(path.join(dir, 'cv.pdf'), req.body.data, 'base64', err => {
                    if (err) {
                        console.log(err);
                    }
                    console.log('File saved!');
                });
                const cv = `uploads/${req.session.user.id}/cv.pdf`;

                // update database
                users.findOneAndUpdate({ id: req.session.user.id }, { $set: { cv } }).then(() => {
                    res.json({ cv });
                });
            }
        });
    }
});

// Upload video
router.post('/api/profile/upload-video/:id', (req, res) => {
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
                        const video = path.join('uploads', req.session.user.id.toString(), name);
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
