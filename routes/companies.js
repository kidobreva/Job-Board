const express = require('express');
const router = express.Router();

// Get candidates
router.get('/api/advert/:id/candidates', (req, res) => {
    // Check for the current user's role
    if (!req.session.user || req.session.user.role !== 'COMPANY') {
        res.sendStatus(401);
    } else {
        const users = req.db.get('users');
        const adverts = req.db.get('adverts');
        adverts.findOne({ id: +req.params.id }).then(advert => {
            // Check if the advert is published by the current user
            if (advert.companyId !== req.session.user.id) {
                res.sendStatus(403);
            } else {
                // get dates and IDs
                const candidatesIds = [];
                const dates = [];
                advert.candidates.forEach((user, i) => {
                    candidatesIds[i] = user.id;
                    dates[i] = user.date;
                });
                users.find({ id: { $in: candidatesIds } }).then(users => {
                    if (!users[0]) {
                        res.sendStatus(404);
                    } else {
                        // send candidates
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
            }
        });
    }
});

// Delete Advert
router.delete('/api/advert/:id', (req, res) => {
    // Check for the current user's role
    if (!req.session.user || req.session.user.role === 'USER') {
        res.sendStatus(401);
    } else {
        const adverts = req.db.get('adverts');
        adverts.findOne({ id: +req.params.id }).then(advert => {
            if (!advert) {
                res.sendStatus(404);
            } else {
                // Check if the advert is published by the current user
                if (advert.companyId !== req.session.user.id) {
                    res.sendStatus(403);
                } else {
                    // Delete the advert
                    adverts.findOneAndDelete({ id: +req.params.id }).then(() => {
                        res.sendStatus(200);
                    });
                }
            }
        });
    }
});

module.exports = router;
