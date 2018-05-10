var express = require('express');
var router = express.Router();

// Advert GET
router.get('/api/advert/:id', function(req, res) {
    console.log('Advert Get:', req.params);

    const adverts = req.db.get('adverts');
    adverts
        .findOne({ id: +req.params.id })
        .then(function(advert) {
            if (advert) {
                console.log('Advert Info:', advert);
                adverts.findOneAndUpdate(
                    { id: +req.params.id },
                    {
                        $set: { views: ++advert.views },
                        $set: {
                            isExpired:
                                Date.now() < advert.expire
                                    ? new Date(advert.expire).toDateString()
                                    : 'Изтекла'
                        }
                    }
                );

                advert.isExpired =
                    Date.now() < advert.expire
                        ? new Date(advert.expire).toDateString()
                        : 'Изтекла';
                res.json(advert);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function(err) {
            console.log(err);
        });
});

module.exports = router;
