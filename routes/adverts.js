const express = require('express');
const router = express.Router();

// (GET) Advert
router.get('/api/advert/:id', function(req, res) {
    const id = +req.params.id;
    const adverts = req.db.get('adverts');
    adverts.findOne({ id }).then(advert => {
        if (!advert) {
            res.sendStatus(404);
        } else if (
            Date.now() > advert.expirationDate &&
            (!req.session.user || req.session.user.role !== 'ADMIN')
        ) {
            res.sendStatus(403);
        } else {
            adverts
                .findOneAndUpdate(
                    { id },
                    {
                        $set: {
                            views: ++advert.views
                        }
                    }
                )
                .then(advert => {
                    (async function() {
                        const category = await req.db
                            .get('categories')
                            .findOne({ id: advert.categoryId });
                        const city = await req.db.get('cities').findOne({ id: advert.cityId });
                        const level = await req.db.get('levels').findOne({ id: advert.levelId });
                        const payment = await req.db
                            .get('payments')
                            .findOne({ id: advert.paymentId });
                        const type = await req.db.get('types').findOne({ id: advert.typeId });
                        const company = await req.db.get('users').findOne({ id: advert.companyId });
                        if (req.query.edit) {
                            advert.categoryId = category.id.toString();
                            advert.cityId = city.id.toString();
                            advert.levelId = level.id.toString();
                            advert.paymentId = payment.id.toString();
                            advert.typeId = type.id.toString();
                        } else {
                            delete advert.categoryId;
                            delete advert.cityId;
                            delete advert.levelId;
                            delete advert.paymentId;
                            delete advert.typeId;

                            advert.category = category.name;
                            advert.city = city.name;
                            advert.level = level.name;
                            advert.payment = payment.name;
                            advert.type = type.name;
                        }
                        advert.img = company.img;
                        advert.company = company.title;
                        res.json(advert);
                    })();
                });
        }
    });
});

// (GET) Adverts
router.get('/api/adverts/:page', (req, res) => {
    const adverts = req.db.get('adverts');
    adverts.count().then(size => {
        const fields = {
            _id: 0,
            cityId: 1,
            company: 1,
            categoryId: 1,
            img: 1,
            typeId: 1,
            levelId: 1,
            salary: 1,
            title: 1,
            paymentId: 1,
            id: 1,
            date: 1
        };
        // TODO: For every advert find the company and take its name and logo
        adverts.find({}, { fields, sort: { id: -1 } }).then(advertsArr => {
            console.log('AdvertsArr', advertsArr);
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

// Add advert
router.post('/api/advert', (req, res) => {
    console.log('[POST] /api/advert:', req.body);

    // Check for the current user's role
    if (!req.session.user || req.session.user.role !== 'COMPANY') {
        res.sendStatus(401);
    } else {
        const advertBody = req.body.advert;
        // Get adverts collection
        const adverts = req.db.get('adverts');
        // get the count to use it later as an Id
        adverts.count().then(count => {
            // check if the user adds or updates an advert
            adverts.findOne({ id: advertBody.id }).then(advert => {
                if (advert) {
                    // Update the advert
                    advert = {
                        categoryId: +advertBody.categoryId,
                        cityId: +advertBody.cityId,
                        description: advertBody.description,
                        levelId: +advertBody.levelId,
                        paymentId: +advertBody.paymentId,
                        salary: {
                            min: advertBody.salary.min,
                            max: advertBody.salary.max
                        },
                        title: advertBody.title,
                        typeId: +advertBody.typeId
                    };
                    adverts.findOneAndUpdate({ id: advert.id }, advert).then(() => {
                        req.session.save(() => {
                            res.sendStatus(200);
                        });
                    });
                } else {
                    // Create the advert
                    const now = Date.now();
                    advert = {
                        id: ++count,
                        candidates: [],
                        categoryId: +advertBody.categoryId,
                        cityId: +advertBody.cityId,
                        company: req.session.user.title,
                        companyId: req.session.user.id,
                        date: now,
                        description: advertBody.description,
                        expirationDate: new Date(now + 1000 * 60 * 60 * 24 * 30).getTime(),
                        img: req.session.user.img,
                        levelId: +advertBody.levelId,
                        paymentId: +advertBody.paymentId,
                        salary: {
                            min: advertBody.salary.min,
                            max: advertBody.salary.max
                        },
                        title: advertBody.title,
                        typeId: +advertBody.typeId,
                        views: 0
                    };

                    // Insert the advert into the database
                    adverts.insert(advert).then(() => {
                        // push the advertId to the user's adverts list
                        const users = req.db.get('users');
                        users
                            .findOneAndUpdate(
                                { id: req.session.user.id },
                                { $push: { adverts: advert.id } }
                            )
                            .then(() => {
                                req.session.save(() => {
                                    res.json({ id: advert.id });
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
                                                req.session.user.lastName}`
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

// (Get) Users
router.get('/api/advert/:id/candidates', (req, res) => {
    // if (!req.session.user) {
    //     res.sendStatus(401);
    // } else {
    const users = req.db.get('users');
    const adverts = req.db.get('adverts');
    adverts.findOne({ id: +req.params.id }).then(advert => {
        const candidatesIds = [];
        const dates = [];
        advert.candidates.forEach((user, i) => {
            candidatesIds[i] = user.id;
            dates[i] = user.date;
        });
        users.find({ id: { $in: candidatesIds } }).then(users => {
            console.log(users);
            if (!users.length) {
                res.sendStatus(404);
            } else {
                const candidates = [];
                users.forEach((user, i) => {
                    delete user.password;
                    candidates[i] = {
                        date: dates[i],
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        cv: user.cv
                    };
                });
                res.json(candidates);
            }
        });
    });

    // }
});

module.exports = router;
