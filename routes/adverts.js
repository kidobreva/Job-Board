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
    const adverts = req.db.get('adverts');
    adverts.count().then(size => {
        adverts.find({}, { sort: { id: -1 } }).then(advertsArr => {
            console.log(advertsArr);
            if (advertsArr[0]) {
                res.json({
                    adverts: advertsArr.slice(
                        (req.params.page - 1) * req.query.size,
                        req.params.page * req.query.size
                    ),
                    len: req.query.size,
                    size
                });
            } else {
                res.sendStatus(404);
            }
        });
    });
});

// (POST) Add advert
router.post('/api/advert', (req, res) => {
    if (!req.session.user && req.session.user.role !== 'COMPANY') {
        res.sendStatus(401);
    } else {
        const adverts = req.db.get('adverts');
        adverts.count().then(len => {
            adverts.find({ id: req.body.id }).then(advert => {
                if (advert[0]) {
                    adverts.findOneAndUpdate({ id: req.body.id }, req.body).then(() => {
                        req.session.save(() => {
                            res.sendStatus(200);
                        });
                    });
                } else {
                    req.body.id = ++len;
                    req.body.company = req.session.user.title;
                    req.body.companyId = req.session.user.id;
                    req.body.logo = req.session.user.img;
                    req.body.views = 0;
                    req.body.candidates = [];
                    req.body.date = Date.now();
                    req.body.expire = new Date(req.body.date + 1000 * 60 * 60 * 24 * 30);
                    adverts.insert(req.body).then(() => {
                        const users = req.db.get('users');
                        users
                            .findOneAndUpdate(
                                { id: req.session.user.id },
                                { $push: { adverts: req.body.id } }
                            )
                            .then(() => {
                                req.session.user.adverts.push(req.body.id);
                                req.session.save(() => {
                                    res.json(req.body.id);
                                });
                            });
                    });
                }
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

// Search my adverts
router.get('/api/search', (req, res) => {
    console.log('Search Adverts:', req.query);
    if (req.query.companyId) {
        req.query.companyId = +req.query.companyId;
    }

    const adverts = req.db.get('adverts');
    adverts.find(req.query).then(adverts => {
        const len = adverts.length;
        if (len) {
            console.log('Adverts:', adverts);
            res.json({
                adverts,
                len
            });
        } else {
            res.sendStatus(404);
            console.log('No adverts!');
        }
    });
});

// Search adverts
router.post('/api/adverts/search', (req, res) => {
    console.log('Search Adverts:', req.body);
    if (req.query.companyId) {
        req.query.companyId = +req.query.companyId;
    }
    if (req.body.title) {
        if (req.body.advanced) {
            req.body.description = { $regex: req.body.title, $options: 'i' };
            delete req.body.advanced;
        }
        req.body.title = { $regex: req.body.title, $options: 'i' };
    }
    const queryArr = [];
    Object.keys(req.body).forEach(prop => {
        if (!req.body[prop]) {
            delete req.body[prop];
        } else {
            queryArr.push({ [prop]: req.body[prop] });
        }
    });
    const adverts = req.db.get('adverts');
    adverts.find({ $or: queryArr }, { sort: { id: -1 } }).then(advertsArr => {
        console.log(advertsArr);
        if (advertsArr[0]) {
            res.json({
                adverts: advertsArr.slice(
                    (req.query.page - 1) * req.query.size,
                    req.query.page * req.query.size
                ),
                len: req.query.size,
                size: advertsArr.length
            });
        } else {
            res.sendStatus(404);
        }
    });
});

// (Get) Users
router.get('/api/advert/:id/candidates', (req, res) => {
    // if (!req.session.user) {
    //     res.sendStatus(401);
    // } else {
    const users = req.db.get('users');
    const adverts = req.db.get('adverts');
    adverts.findOne({ id: +req.params.id }).then(advert => {
        users.find({ id: { $all: advert.candidates } }).then(users => {
            console.log(users);
            if (!users.length) {
                res.sendStatus(404);
            } else {
                users.forEach(user => {
                    delete user.password;
                });
                res.json(users);
            }
        });
    });

    // }
});

module.exports = router;
