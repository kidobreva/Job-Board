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
    const fields = {
        password: 0,
        role: 0,
        _id: 0,
        messages: 0
    }

    req.db
        .get('users')
        .findOne({ id: +req.params.id, role: 'COMPANY' }, {fields})
        .then(company => {
            if (company) {
                console.log('Company Info:', company);
                req.db.get('adverts').find({id: {$in: company.adverts}}).then(adverts => {
                    const advs = [];
                        adverts.forEach((advert, i) => {
                            advs[i] = {
                                title: advert.title,
                                cityId: advert.cityId,
                                salary: advert.salary,
                                date: advert.date,
                                categoryId: advert.categoryId
                            };
                        });
                        company.adverts = advs;
                        res.json(company);
                });                
            } else {
                res.sendStatus(404);
            }
        });
});

module.exports = router;
