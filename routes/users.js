const express = require('express');
const router = express.Router();

// Save advert to favourites
router.post('/api/favourite/:id', (req, res) => {
    // Check for the current user's role
    if (!req.session.user || req.session.user.role !== 'USER') {
        res.sendStatus(401);
    } else {
        // Find the user
        req.db
            .get('users')
            .findOneAndUpdate(
                { id: req.session.user.id },
                { $push: { favourites: +req.params.id } }
            )
            .then(user => {
                if (!user) {
                    // If the user is not in the database, destroy his session
                    req.session.destroy(err => {
                        res.clearCookie('connect.sid');
                        res.sendStatus(err ? 500 : 410);
                    });
                } else {
                    res.sendStatus(200);
                }
            });
    }
});

// Apply for an advert
router.post('/api/apply/:id', (req, res) => {
    // Check for the current user's role
    if (!req.session.user || req.session.user.role !== 'USER') {
        res.sendStatus(401);
    } else {
        const users = req.db.get('users');
        // Find the user
        users
            .findOneAndUpdate({ id: req.session.user.id }, { $push: { applied: +req.params.id } })
            .then(user => {
                if (!user) {
                    // If the user is not in the database, destroy his session
                    req.session.destroy(err => {
                        res.clearCookie('connect.sid');
                        res.sendStatus(err ? 500 : 410);
                    });
                } else {
                    const adverts = req.db.get('adverts');
                    adverts.findOne({ id: +req.params.id }).then(advert => {
                        // Check if the user has already applied to that advert
                        const index = advert.candidates.findIndex(
                            advert => advert.id === req.session.user.id
                        );
                        if (index !== -1) {
                            res.sendStatus(409);
                        } else {
                            // Push the user to the advert's candidates list
                            adverts
                                .findOneAndUpdate(
                                    { id: +req.params.id },
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
                                    // Send message to the company
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
                                        // Update the database
                                        users
                                            .findOneAndUpdate(
                                                { id: advert.companyId },
                                                { $push: { messages: len } }
                                            )
                                            .then(() => {
                                                res.sendStatus(200);
                                            });
                                    });
                                });
                        }
                    });
                }
            });
    }
});

// Get company
router.get('/api/company/:id', (req, res) => {
    // Choose which fields won't be sent
    const fields = {
        _id: 0,
        role: 0,
        messages: 0,
        password: 0
    };
    // Find the company
    req.db
        .get('users')
        .findOne({ id: +req.params.id, role: 'COMPANY' }, { fields })
        .then(company => {
            if (!company) {
                res.sendStatus(404);
            } else {
                // Prepare the adverts data
                req.db
                    .get('adverts')
                    .find({ id: { $in: company.adverts } })
                    .then(advertsArr => {
                        const adverts = [];
                        advertsArr.forEach((advert, i) => {
                            adverts[i] = {
                                date: advert.date,
                                title: advert.title,
                                cityId: advert.cityId,
                                salary: advert.salary,
                                categoryId: advert.categoryId
                            };
                        });
                        company.adverts = adverts;
                        res.json(company);
                    });
            }
        });
});

// Get companies
router.get('/api/companies', (req, res) => {
    // Choose which fields will be sent
    const fields = {
        id: 1,
        img: 1,
        title: 1
    };
    req.db
        .get('users')
        .find({ role: 'COMPANY' }, { fields })
        .then(companies => {
            if (companies[0]) {
                res.json(companies);
            } else {
                res.sendStatus(404);
            }
        });
});

module.exports = router;
