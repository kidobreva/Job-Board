var express = require('express');
var router = express.Router();

router.get('/company/:id', function(req, res, next) {
    console.log('Company Get:', req.params);

    req.db
        .get('users')
        .findOne({ id: +req.params.id, isCompany: true })
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

module.exports = router;
