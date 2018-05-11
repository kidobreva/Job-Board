var express = require('express');
var router = express.Router();

// Send message POST
router.post('/api/send-message', function(req, res) {
    console.log('Send message Post:', req.body);

    const users = req.db.get('users');
    users
        .findOne({ id: 0 })
        .then(function(user) {
            if (user) {
                // save to database
                user.messages.push(req.body);
                users.findOneAndUpdate({ id: 0 }, user).then(function() {
                    res.sendStatus(200);
                });
            }
        })
        .catch(function(err) {
            console.log(err);
        });
});

module.exports = router;
