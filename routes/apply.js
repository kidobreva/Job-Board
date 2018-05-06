var express = require('express');
var router = express.Router();

router.post('/apply', function(req, res, next) {
    console.log('Apply Post:', req.body);

    const users = req.db.get('users');
    users
        .findOne({ id: req.session.user.id })
        .then(function(user) {
            if (user) {
                var adverts = req.db.get('adverts');
                adverts.findOne({ id: req.body.id }).then(function(advert) {
                    advert.candidates.push(req.session.user.id);
                    adverts.findOneAndUpdate({ id: req.body.id }, advert);
                });

                // save to session
                req.session.user.applied.push(req.body);
                req.session.save();

                // save to database
                user.applied.push(req.body);
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
