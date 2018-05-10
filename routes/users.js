var express = require('express');
var router = express.Router();

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

module.exports = router;
