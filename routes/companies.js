const express = require('express');
const router = express.Router();

// (Admin) Companies GET
router.get('/api/companies', function(req, res) {
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

// Company GET
router.get('/api/company/:id', function(req, res) {
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
