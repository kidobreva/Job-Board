var express = require('express');
var router = express.Router();

// Add advert POST
router.post('/api/add-advert', function(req, res) {
    console.log('Add Advert Post:', req.body);

    var advertsCollection = req.db.get('adverts');
    advertsCollection
        .findOne(req.body)
        .then(function(advert) {
            // if (!advert) {
            advertsCollection.find().then(function(array) {
                req.body.id = array.length || 1;
                req.body.candidates = [];
                req.body.views = 0;
                req.body.company = req.session.user.title;
                req.body.date = Date.now();
                req.body.expire = new Date(
                    req.body.date + 1000 * 60 * 60 * 24 * 30
                );
                advertsCollection.insert(req.body).then(function(advert) {
                    console.log('New advert has been added:', advert);
                    res.sendStatus(200);
                });
            });
            // }
        })
        .catch(function(err) {
            console.log(err);
        });
});

module.exports = router;
