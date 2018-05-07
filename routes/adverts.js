var express = require('express');
var router = express.Router();

router.get('/adverts', function(req, res, next) {
    console.log('Adverts Get:', req.body);

    req.db
        .get('adverts')
        .find()
        .then(function(adverts) {
            if (adverts.length) {
                console.log('Adverts:', adverts);
                res.json(adverts);
            } else {
                res.sendStatus(404);
                console.log('No adverts!')
            }
        }).catch (function (err) {
          console.log(err);
        });
});

module.exports = router;
