var express = require('express');
var router = express.Router();

router.post('/favourite', function(req, res, next) {
    console.log('Favourite Get:', req.body);

    const users = req.db.get('users');
    users
        .findOne({ id: req.session.user.id })
        .then(function(user) {
            if (user) {
                // save to session
                req.session.user.favourites.push(req.body);
                req.session.save();

                // save to database
                user.favourites.push(req.body);
                req.db.get('users');
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
