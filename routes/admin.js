const express = require('express');
const router = express.Router();

// Advert DELETE
router.delete('/api/advert/:id', function(req, res) {
    console.log('Advert Delete:', req.params);

    req.db
        .get('adverts')
        .findOneAndDelete({ id: +req.params.id })
        .then(function(advert) {
            if (advert) {
                console.log('Advert Deleted:', advert);
                res.sendStatus(200);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function(err) {
            console.log(err);
        });
});

// (Admin) Company block PATCH
router.patch('/api/company/block/:id', function(req, res) {
    console.log('Company Block:', req.query);

    req.db
        .get('users')
        .findOneAndUpdate(
            { id: +req.params.id, isCompany: true },
            { $set: req.body }
        )
        .then(function(company) {
            if (company) {
                console.log('Company Info:', company);
                res.json(company);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function(err) {
            console.log(err);
        });
});

// (Admin) User block PATCH
router.patch('/api/user/block/:id', function(req, res) {
    console.log('User Block:', req.query);

    req.db
        .get('users')
        .findOneAndUpdate(
            { id: +req.params.id, isCompany: false },
            { $set: req.body }
        )
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

// Send message to Admin POST
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
