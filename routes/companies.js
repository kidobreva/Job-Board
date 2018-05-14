const express = require('express');
const router = express.Router();

// (Admin) Companies GET
router.get('/api/companies', (req, res) => {
    req.db
        .get('users')
        .find({ role: 'COMPANY' })
        .then(companies => {
            if (companies[0]) {
                res.json(companies);
            } else {
                res.sendStatus(404);
            }
        });
});

// Company GET
router.get('/api/company/:id', (req, res) => {
    console.log('Company Get:', req.params);

    req.db
        .get('users')
        .findOne({ id: +req.params.id, role: 'COMPANY' })
        .then(company => {
            if (company) {
                console.log('Company Info:', company);
                res.json(company);
            } else {
                res.sendStatus(404);
            }
        });
});

module.exports = router;
