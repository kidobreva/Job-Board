var express = require('express');
var router = express.Router();

// User GET
router.get('/user/:id', function(req, res) {
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

module.exports = router;
