const express = require('express');
const router = express.Router();

// User GET
router.get('/api/user/:id', (req, res) => {
    console.log('User Get:', req.params);
    if (!req.session.user && req.session.user.role === 'USER') {
        res.sendStatus(401);
    } else {
        req.db
            .get('users')
            .findOne({ id: +req.params.id })
            .then(user => {
                if (user) {
                    console.log('User Info:', user);
                    res.json(user);
                } else {
                    res.sendStatus(404);
                }
            });
    }
});

// Favourite POST
router.post('/api/favourite', (req, res) => {
    console.log('Favourite Post:', req.body.data);
    if (!req.session.user && req.session.user.role !== 'USER') {
        res.sendStatus(401);
    } else {
        const users = req.db.get('users');
        users.findOne({ id: req.session.user.id }).then(user => {
            if (!user) {
                console.log('No user!');
            } else {
                // save to database
                users
                    .findOneAndUpdate(
                        { id: req.session.user.id },
                        { $push: { favourites: req.body.data } }
                    )
                    .then(() => {
                        req.session.user.favourites.push(req.body.data);
                        req.session.save(() => {
                            res.sendStatus(200);
                        });
                    });
            }
        });
    }
});

module.exports = router;
