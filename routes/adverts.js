const express = require('express');
const router = express.Router();

// Get Advert
router.get('/api/advert/:id', function(req, res) {
    const id = +req.params.id;
    const adverts = req.db.get('adverts');
    adverts.findOne({ id }).then(advert => {
        // Check if the advert exists
        if (!advert) {
            res.sendStatus(404);
        } else if (
            // Check if the advert is expired
            Date.now() > advert.expirationDate &&
            (!req.session.user || req.session.user.role !== 'ADMIN')
        ) {
            res.sendStatus(403);
        } else {
            // Increment the views
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
                    if (!advert) {
                        res.sendStatus(404);
                    } else {
                        (async function() {
                            // Wait for the data to come
                            const category = await req.db
                                .get('categories')
                                .findOne({ id: advert.categoryId });
                            const city = await req.db.get('cities').findOne({ id: advert.cityId });
                            const level = await req.db
                                .get('levels')
                                .findOne({ id: advert.levelId });
                            const payment = await req.db
                                .get('payments')
                                .findOne({ id: advert.paymentId });
                            const type = await req.db.get('types').findOne({ id: advert.typeId });
                            const company = await req.db
                                .get('users')
                                .findOne({ id: advert.companyId });

                            if (req.query.edit) {
                                // If the user edits the advert
                                advert.categoryId = category.id.toString();
                                advert.cityId = city.id.toString();
                                advert.levelId = level.id.toString();
                                advert.paymentId = payment.id.toString();
                                advert.typeId = type.id.toString();
                            } else {
                                // Delete props to send less data
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
                    }
                });
        }
    });
});

// Add advert
router.post('/api/advert', (req, res) => {
    // Check for the current user's role
    if (!req.session.user || req.session.user.role !== 'COMPANY') {
        res.sendStatus(401);
    } else {
        const advertBody = req.body.advert;
        // Get adverts collection
        const adverts = req.db.get('adverts');
        // get the count to use it later as an id
        adverts.count().then(count => {
            // check if the user adds or updates an advert
            adverts.findOne({ id: advertBody.id }).then(advert => {
                if (advert) {
                    // Update the advert if it already exists
                    const updatedFields = {
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
                    adverts
                        .findOneAndUpdate({ id: advert.id }, { $set: updatedFields })
                        .then(() => {
                            res.json({ id: advert.id });
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
                            .then(user => {
                                if (!user) {
                                    // If the user is not in the database, destroy his session
                                    req.session.destroy(err => {
                                        res.clearCookie('connect.sid');
                                        res.sendStatus(err ? 500 : 410);
                                    });
                                } else {
                                    res.json({ id: advert.id });
                                }
                            });
                    });
                }
            });
        });
    }
});

module.exports = router;
