const express = require('express');
const router = express.Router();
const fs = require('fs');

// Profile GET
router.get('/api/profile', function(req, res) {
    if (req.session.user) {
        res.json(req.session.user);
    } else {
        res.sendStatus(401);
    }
});

// Profile POST
router.post('/api/profile/upload-picture/:id', function(req, res) {
    console.log('Profile Post:', req.body.data);

    // Create folder for user
    // const dir = `uploads/${req.session.user.id.toString()}/`;
    // if (!fs.existsSync('uploads')) {
    //     fs.mkdirSync('uploads');
    // }
    // if (!fs.existsSync(dir)) {
    //     fs.mkdirSync(dir);
    // }
    // if (req.body.data.slice(0, 10) === 'data:image') {
    //     fs.writeFile(
    //         dir + `/profile.${req.body.data.slice(11, 14)}`,
    //         Buffer.from(req.body.data.slice(22), 'base64'),
    //         err => {
    //             if (err) {
    //                 console.log(err);
    //             }
    //             console.log('File saved!');
    //         }
    //     );
    // }

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
                users
                    .findOneAndUpdate({ id: req.session.user.id }, user)
                    .then(function() {
                        res.json({ img: img });
                    });
            } else {
                console.log('No user!');
            }
        })
        .catch(function(err) {
            console.log(err);
        });
});

// Profile edit
router.post('/api/profile/edit', function(req, res) {
    console.log('Profile Post:', req.body.data);

    const users = req.db.get('users');
    users
        .findOne({ id: req.session.user.id })
        .then(function(user) {
            if (user) {
                // edit
                if (req.body.newPassword) {
                    user.password = req.body.newPassword;
                    delete req.body.newPassword;
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
                users
                    .findOneAndUpdate({ id: req.session.user.id }, user)
                    .then(function() {
                        res.json(user);
                    });
            } else {
                console.log('No user!');
            }
        })
        .catch(function(err) {
            console.log(err);
        });
});

module.exports = router;
