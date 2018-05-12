const express = require('express');
const router = express.Router();

// Get the current user from session
router.get('/api/currentUser', function(req, res) {
    if (req.session.user) {
        res.json(req.session.user['_id']);
    } else {
        res.sendStatus(401);
    }
});

// Get users
router.get('/api/users', function(req, res) {
    console.log('Users Get:', req.body);

    req.db
        .get('users')
        .find({ isCompany: false })
        .then(function(users) {
            if (users.length) {
                users.forEach(function(user) {
                    delete user.password;
                });
                console.log('Users:', users);
                res.json(users);
            } else {
                console.log('No users!');
            }
        })
        .catch(function(err) {
            console.log(err);
        });
});

// User GET
router.get('/api/user/:id', function(req, res) {
    console.log('User Get:', req.params);

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
});

// Favourite POST
router.post('/api/favourite', function(req, res) {
    console.log('Favourite Post:', req.body.data);

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
});

module.exports = router;
