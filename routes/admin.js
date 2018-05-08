var express = require('express');
var router = express.Router();

// Advert DELETE
router.delete('/advert/:id', function(req, res, next) {
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
router.patch('/company/block/:id', function(req, res, next) {
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
router.patch('/user/block/:id', function(req, res, next) {
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

module.exports = router;
