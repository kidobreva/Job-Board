const express = require('express');
const router = express.Router();

// Favourite POST
router.post('/api/favourite', (req, res) => {
    console.log('Favourite Post:', req.body.data);
    if (!req.session.user && req.session.user.role !== 'USER') {
        res.sendStatus(401);
    } else {
        const users = req.db.get('users');
        users.findOne({ id: req.session.user.id }).then(user => {
            if (!user) {
                console.log('No user!');
            } else {
                // save to database
                users
                    .findOneAndUpdate(
                        { id: req.session.user.id },
                        { $push: { favourites: req.body.data } }
                    )
                    .then(() => {
                        req.session.user.favourites.push(req.body.data);
                        req.session.save(() => {
                            res.sendStatus(200);
                        });
                    });
            }
        });
    }
});

// (POST) Apply for an advert
router.post('/api/apply', (req, res) => {
    if (!req.session.user) {
        res.sendStatus(401);
    } else if (req.session.user.role === 'COMPANY') {
        res.sendStatus(403);
    } else {
        const users = req.db.get('users');
        users
            .findOneAndUpdate({ id: req.session.user.id }, { $push: { applied: req.body.data } })
            .then(user => {
                if (!user) {
                    console.log('No user!');
                } else {
                    req.db
                        .get('adverts')
                        .findOneAndUpdate(
                            { id: req.body.data },
                            {
                                $push: {
                                    candidates: {
                                        id: req.session.user.id,
                                        date: Date.now()
                                    }
                                }
                            }
                        )
                        .then(advert => {
                            const messages = req.db.get('messages');
                            messages.count().then(len => {
                                ++len;
                                messages.insert({
                                    id: len,
                                    date: Date.now(),
                                    advertId: advert.id,
                                    advertTitle: advert.title,
                                    candidate: {
                                        cv: req.session.user.cv,
                                        name: `${req.session.user.firstName} ${
                                            req.session.user.lastName
                                        }`
                                    }
                                });
                                users
                                    .findOneAndUpdate(
                                        { id: advert.companyId },
                                        { $push: { messages: len } }
                                    )
                                    .then(() => {
                                        req.session.user.applied.push(req.body.data);
                                        req.session.save(() => {
                                            res.sendStatus(200);
                                        });
                                    });
                            });
                        });
                }
            });
    }
});

// Companies GET
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
    };

    req.db
        .get('users')
        .findOne({ id: +req.params.id, role: 'COMPANY' }, { fields })
        .then(company => {
            if (company) {
                console.log('Company Info:', company);
                req.db
                    .get('adverts')
                    .find({ id: { $in: company.adverts } })
                    .then(adverts => {
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
