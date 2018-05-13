const express = require('express');
const router = express.Router();

// User GET
router.get('/api/user/:id', function(req, res) {
    console.log('User Get:', req.params);
    if (!req.session.user && (!req.session.user.isCompany || !req.session.user.isAdmin)) {
        res.sendStatus(401);
    } else {
        req.db
            .get('users')
            .findOne({ id: +req.params.id })
            .then(function(user) {
                if (user) {
                    console.log('User Info:', user);
                    res.json(user);
                } else {
                    res.sendStatus(404);
                }
            })
            .catch(function(err) {
                console.log(err);
            });
    }
});

// Favourite POST
router.post('/api/favourite', function(req, res) {
    console.log('Favourite Post:', req.body.data);
    if (!req.session.user && (req.session.user.isCompany || req.session.user.isAdmin)) {
        res.sendStatus(401);
    } else {
        const users = req.db.get('users');
        users
            .findOne({ id: req.session.user.id })
            .then(function(user) {
                if (user) {
                    // save to session
                    req.session.user.favourites.push(req.body.data);
                    req.session.save();

                    // save to database
                    user.favourites.push(req.body.data);
                    users.findOneAndUpdate({ id: req.session.user.id }, user);
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
