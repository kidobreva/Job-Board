var express = require('express');
var router = express.Router();

router.get('/companies', function(req, res, next) {
    console.log('Companies Get:', req.body);

    req.db
        .get('users')
        .find({ isCompany: true })
        .then(function(companies) {
            if (companies.length) {
                console.log('Companies:', companies);
                res.json(companies);
            } else {
                console.log('No companies!');
            }
        })
        .catch(function(err) {
            console.log(err);
        });
});

module.exports = router;
