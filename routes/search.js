var express = require('express');
var router = express.Router();

// Search GET
router.get('/search', function(req, res) {
    console.log('Search Adverts:', req.query);

    req.db
        .get('adverts')
        .find(req.query)
        .then(function(adverts) {
            if (adverts.length) {
                console.log('Adverts:', adverts);
                res.json(adverts);
            } else {
                res.sendStatus(404);
                console.log('No adverts!');
            }
        })
        .catch(function(err) {
            console.log(err);
        });
});

module.exports = router;
