var express = require('express');
var router = express.Router();

router.post('/add-advert', function(req, res, next) {
    console.log('Add Advert Post:', req.body);

    var advertsCollection = req.db.get('adverts');
    advertsCollection
        .findOne(req.body)
        .then(function(advert) {
            if (!advert) {
                advertsCollection.find().then(function(array) {
                    req.body.id = array.length || 1;
                    advertsCollection.insert(req.body).then(function(advert) {
                        console.log('New advert has been added:', advert);
                        res.sendStatus(200);
                    });
                });
            }
        })
        .catch(function(err) {
            console.log(err);
        });
});

module.exports = router;
