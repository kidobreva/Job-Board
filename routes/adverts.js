const express = require('express');
const router = express.Router();

// (GET) Advert
router.get('/api/advert/:id', function(req, res) {
    const id = +req.params.id;
    const adverts = req.db.get('adverts');
    adverts.findOne({ id }).then(function(advert) {
        if (advert) {
            adverts.findOneAndUpdate(
                { id },
                {
                    $set: {
                        views: ++advert.views,
                        isExpired:
                            Date.now() < advert.expire
                                ? advert.expire
                                : 'Изтекла'
                    }
                }
            );

            advert.isExpired =
                Date.now() < advert.expire ? advert.expire : 'Изтекла';
            res.json(advert);
        } else {
            res.sendStatus(404);
        }
    });
});

// (GET) Adverts
router.get('/api/adverts', function(req, res) {
    req.db
        .get('adverts')
        .find({}, { sort: { id: -1 } })
        .then(function(advertsArr) {
            if (advertsArr[0]) {
                res.json(advertsArr);
            } else {
                res.sendStatus(404);
            }
        });
});

// (POST) Add advert
router.post('/api/advert', function(req, res) {
    if (req.session.user.isCompany) {
        const adverts = req.db.get('adverts');
        adverts.stats().then(stats => {
            req.body.id = ++stats.count;
            req.body.company = req.session.user.title;
            req.body.companyId = req.session.user.id;
            req.body.views = 0;
            req.body.candidates = [];
            req.body.date = Date.now();
            req.body.expire = new Date(
                req.body.date + 1000 * 60 * 60 * 24 * 30
            );
            adverts.insert(req.body).then(function() {
                res.sendStatus(200);
            });
        });
    }
});

// (POST) Apply for an advert
router.post('/api/apply', function(req, res) {
    const users = req.db.get('users');
    users
        .findOne({ id: req.session.user.id })
        .then(function(user) {
            if (user) {
                var adverts = req.db.get('adverts');
                adverts.findOne({ id: req.body.data }).then(function(advert) {
                    users
                        .findOne({ id: advert.companyId })
                        .then(function(user) {
                            user.notifications.unshift({
                                candidateId: req.session.user.id,
                                advertId: advert.id,
                                message: `${req.session.user.firstName} ${
                                    req.session.user.lastName
                                } кандидатства за вашата обява - ${
                                    advert.title
                                }!`
                            });
                            users.findOneAndUpdate({ id: user.id }, user);
                        });
                    advert.candidates.push(req.session.user.id);
                    adverts.findOneAndUpdate({ id: req.body.data }, advert);
                });

                // save to session
                req.session.user.applied.push(req.body.data);
                req.session.save();

                // save to database
                user.applied.push(req.body.data);
                users.findOneAndUpdate({ id: req.session.user.id }, user);
            } else {
                console.log('No user!');
            }
        })
        .catch(function(err) {
            console.log(err);
        });
});

// (GET) Search adverts
router.get('/api/search', function(req, res) {
    console.log('Search Adverts:', req.query);

    const adverts = req.db.get('adverts');
    adverts
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
