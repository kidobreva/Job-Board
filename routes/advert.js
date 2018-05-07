var express = require('express');
var router = express.Router();

router.get('/advert/:id', function(req, res, next) {
    console.log('Advert Get:', req.params);

    req.db
        .get('adverts')
        .findOne({id: +req.params.id})
        .then(function(advert) {
            if (advert) {
                console.log('Advert Info:', advert);
                res.json(advert);
            } else {
              res.sendStatus(404);
            }
        }).catch (function (err) {
          console.log(err);
        });
});

module.exports = router;
