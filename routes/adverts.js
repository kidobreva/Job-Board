const express = require('express');
const router = express.Router();

// (GET) Advert
router.get('/api/advert/:id', function(req, res) {
    const id = +req.params.id;
    const adverts = req.db.get('adverts');
    adverts.findOne({ id }).then(function(advert) {
        if (!advert) {
            res.sendStatus(404);
        } else {
            adverts.findOneAndUpdate(
                { id },
                {
                    $set: {
                        views: ++advert.views,
                        isExpired: Date.now() < advert.expire ? advert.expire : 'Изтекла'
                    }
                }
            );

            advert.isExpired = Date.now() < advert.expire ? advert.expire : 'Изтекла';
            res.json(advert);
        }
    });
});

// (GET) Adverts
router.get('/api/adverts/:page', (req, res) => {
    req.db
        .get('adverts')
        .find({}, { sort: { id: -1 } })
        .then(advertsArr => {
            console.log(advertsArr);
            if (advertsArr[0]) {
                res.json({
                    adverts: advertsArr.slice((req.params.page - 1) * 10, req.params.page * 10),
                    len: advertsArr.length
                });
            } else {
                res.sendStatus(404);
            }
        });
});

// (POST) Add advert
router.post('/api/advert', (req, res) => {
    if (!req.session.user && req.session.user.role !== 'COMPANY') {
        res.sendStatus(401);
    } else {
        const adverts = req.db.get('adverts');
        adverts.find().then(advertsArr => {
            req.body.id = ++advertsArr.length;
            req.body.company = req.session.user.title;
            req.body.companyId = req.session.user.id;
            req.body.views = 0;
            req.body.candidates = [];
            req.body.date = Date.now();
            req.body.expire = new Date(req.body.date + 1000 * 60 * 60 * 24 * 30);
            adverts.insert(req.body).then(() => {
                const users = req.db.get('users');
                users.findOneAndUpdate({id: req.session.user.id}, {$push: {adverts: req.body}}).then(() => {
                    req.session.user.adverts.push(req.body);
                    req.session.save().then(() => {
                        res.sendStatus(200);
                    });
                });
            });
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
                            { $push: { candidates: req.session.user.id } }
                        )
                        .then(advert => {
                            const notification = {
                                candidateId: req.session.user.id,
                                advertId: advert.id,
                                message: `${req.session.user.firstName} ${
                                    req.session.user.lastName
                                } кандидатства за вашата обява - ${advert.title}!`
                            };
                            users
                                .findOneAndUpdate(
                                    { id: advert.companyId },
                                    { $push: { notifications: notification } }
                                )
                                .then(() => {
                                    req.session.user.applied.push(req.body.data);
                                    req.session.save(() => {
                                        res.sendStatus(200);
                                    });
                                });
                        });
                }
            });
    }
});

// (GET) Search adverts
router.get('/api/search', (req, res) => {
    console.log('Search Adverts:', req.query);

    const adverts = req.db.get('adverts');
    adverts.find(req.query).then(adverts => {
        if (adverts.length) {
            console.log('Adverts:', adverts);
            res.json(adverts);
        } else {
            res.sendStatus(404);
            console.log('No adverts!');
        }
    });
});

module.exports = router;
