var express = require('express');
var router = express.Router();

// Get the current user from session
router.get('/currentUser', function(req, res, next) {
  if (req.session.user) {
    res.json(req.session.user['_id']);
  } else {
    res.sendStatus(401);
  }
});

// Get users
router.get('/users', function(req, res, next) {
    console.log('Users Get:', req.body);

    req.db
        .get('users')
        .find()
        .then(function(users) {
            if (users.length) {
                console.log('Users:', users);
                delete user.password;
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
