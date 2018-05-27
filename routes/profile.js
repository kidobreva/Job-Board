const express = require('express');
const router = express.Router();
const sha1 = require('sha1');
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const mime = require('mime');

// (GET) Profile
router.get('/api/profile', (req, res) => {
    if (req.session.user) {
        req.db
            .get('users')
            .findOne({ id: req.session.user.id })
            .then(user => {
                if (user) {
                    res.json(user);
                } else {
                    req.session.destroy(err => {
                        res.clearCookie('connect.sid');
                        res.sendStatus(err ? 500 : 200);
                    });
                }
            });
    } else {
        res.sendStatus(401);
    }
});

// (GET) Profile
router.get('/api/edit-profile', (req, res) => {
    if (req.session.user) {
        req.db
            .get('users')
            .findOne({ id: req.session.user.id })
            .then(user => {
                console.log(user);
                if (user) {
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
                } else {
                    req.session.destroy(err => {
                        res.clearCookie('connect.sid');
                        res.sendStatus(err ? 500 : 200);
                    });
                }
            });
    } else {
        res.sendStatus(401);
    }
});

// (POST) Upload picture
router.post('/api/profile/upload-picture/:id', (req, res) => {
    console.log('Profile Post:', req.body);
    if (!req.session.user) {
        res.sendStatus(401);
    } else {
        const users = req.db.get('users');
        users.findOne({ id: req.session.user.id }).then(user => {
            if (user) {
                let img = req.body.img;

                // Create folder for user
                const dir = path.join(
                    'public',
                    path.join('uploads', req.session.user.id.toString())
                );
                if (!fs.existsSync(path.join('public', 'uploads'))) {
                    fs.mkdirSync(path.join('public', 'uploads'));
                }
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir);
                }
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

                // save to database
                users.findOneAndUpdate({ id: req.session.user.id }, { $set: { img } }).then(() => {
                    req.session.user.img = img;
                    req.session.save(() => {
                        res.sendStatus(200);
                    });
                });
            } else {
                console.log('No user!');
            }
        });
    }
});

// Profile edit
router.post('/api/profile/edit', (req, res) => {
    console.log('Profile Post:', req.body);
    console.log(req.session.user);
    if (!req.session.user) {
        res.sendStatus(401);
    } else {
        const users = req.db.get('users');
        users.findOne({ id: req.session.user.id }).then(user => {
            if (user) {
                if (sha1(req.body.currentPass) !== user.password) {
                    res.sendStatus(401);
                } else {
                    // edit
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
                        // delete req.body.newPassword;
                        // delete req.body.repeatNewPassword;
                        // delete req.body.currentPass;
                    }

                    // save to database
                    users.findOneAndUpdate({ id: req.session.user.id }, user).then(() => {
                        // req.session.user = user;
                        // req.session.save(() => {
                        res.sendStatus(200);
                        // });
                    });
                }
            } else {
                console.log('No user!');
            }
        });
    }
});

// Upload CV POST
router.post('/api/profile/upload-cv/:id', (req, res) => {
    console.log('CV Post:', req.body.data);
    if (!req.session.user && req.session.user.role !== 'USER') {
        res.sendStatus(401);
    } else {
        const users = req.db.get('users');
        users.findOne({ id: req.session.user.id }).then(user => {
            if (user) {
                req.body.data = req.body.data.replace('data:application/pdf;base64,', '');
                // Create folder for user
                const dir = path.join(
                    'public',
                    path.join('uploads', req.session.user.id.toString())
                );
                if (!fs.existsSync(path.join('public', 'uploads'))) {
                    fs.mkdirSync(path.join('public', 'uploads'));
                }
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir);
                }
                fs.writeFile(path.join(dir, 'cv.pdf'), req.body.data, 'base64', err => {
                    if (err) {
                        console.log(err);
                    }
                    console.log('File saved!');
                });

                const cv = `uploads/${req.session.user.id}/cv.pdf`;

                // save to database
                users.findOneAndUpdate({ id: req.session.user.id }, { $set: { cv } }).then(() => {
                    req.session.user.cv = cv;
                    req.session.save(() => {
                        res.json({ cv });
                    });
                });
            } else {
                console.log('No user!');
            }
        });
    }
});

// Upload pictures
router.post('/api/profile/upload-pictures/:id', (req, res) => {
    if (!req.session.user && req.session.user.role !== 'COMPANY') {
        res.sendStatus(401);
    } else {
        const users = req.db.get('users');
        users.findOne({ id: req.session.user.id }).then(user => {
            if (user) {
                let name;
                var storage = multer.diskStorage({
                    destination: function(req, file, cb) {
                        // Create folder for user
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
                var upload = multer({ storage }).single('file');
                upload(req, res, function(err) {
                    if (err) {
                        res.sendStatus(400);
                    } else {
                        // save to database
                        const picture = path.join('uploads', req.session.user.id.toString(), name);
                        users
                            .findOneAndUpdate(
                                { id: req.session.user.id },
                                { $push: { pictures: picture } }
                            )
                            .then(() => {
                                req.session.save(() => {
                                    res.json(200);
                                });
                            });
                    }
                });
            } else {
                console.log('No user!');
            }
        });
    }
});

// Upload video
router.post('/api/profile/upload-video/:id', (req, res) => {
    if (!req.session.user && req.session.user.role !== 'COMPANY') {
        res.sendStatus(401);
    } else {
        const users = req.db.get('users');
        users.findOne({ id: req.session.user.id }).then(user => {
            if (user) {
                var storage = multer.diskStorage({
                    destination: function(req, file, cb) {
                        // Create folder for user
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
                        cb(null, 'video.' + mime.getExtension(file.mimetype));
                    }
                });
                var upload = multer({ storage }).single('file');
                upload(req, res, function(err) {
                    if (err) {
                        res.sendStatus(400);
                    } else {
                        // save to database
                        const video = path.join(
                            'uploads',
                            req.session.user.id.toString(),
                            'video.mp4'
                        );
                        users
                            .findOneAndUpdate({ id: req.session.user.id }, { $set: { video } })
                            .then(() => {
                                req.session.user.video = video;
                                req.session.save(() => {
                                    res.json({ video });
                                });
                            });
                    }
                });
            } else {
                console.log('No user!');
            }
        });
    }
});

module.exports = router;
