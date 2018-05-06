var express = require('express');
var router = express.Router();

router.post('/add-advert', function(req, res, next) {
    console.log('Add Advert Post:', req.body);

    req.db
        .get('adverts')
        .findOne(req.body)
        .then(function(advert) {
            if (!advert) {
                req.db
                    .get('adverts')
                    .insert(req.body)
                    .then(function(advert) {
                        console.log('New advert has been added:', advert);
                        res.sendStatus(200);
                    });
            }
        })
        .catch(function(err) {
            console.log(err);
        });
});

module.exports = router;
