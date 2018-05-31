const express = require('express');
const router = express.Router();

// Get statistics
router.get('/api/admin/statistics', (req, res) => {
    // Check for the current user's role
    if (!req.session.user || req.session.user.role !== 'ADMIN') {
        res.sendStatus(401);
    } else {
        const users = req.db.get('users');
        const adverts = req.db.get('adverts');
        const categories = req.db.get('categories');
        let numberOfUsers;
        let numberOfAdverts;
        let numberOfCategories;
        let numberOfCandidates;
        let numberOfCompanies;
        // Count the documents
        // users
        users.count().then(count => {
            numberOfUsers = count;
            // adverts
            adverts.count().then(count => {
                numberOfAdverts = count;
                // categories
                categories.count().then(count => {
                    numberOfCategories = count;
                    // candidates
                    users.find({ role: 'USER' }).then(candidates => {
                        numberOfCandidates = candidates.length;
                        // candidates
                        users.find({ role: 'COMPANY' }).then(companies => {
                            numberOfCompanies = companies.length;
                            res.json({
                                numberOfUsers,
                                numberOfAdverts,
                                numberOfCategories,
                                numberOfCandidates,
                                numberOfCompanies
                            });
                        });
                    });
                });
            });
        });
    }
});

/* ––––– USERS ––––– */

// Get users
router.get('/api/admin/users', (req, res) => {
    // Check for the current user's role
    if (!req.session.user || req.session.user.role !== 'ADMIN') {
        res.sendStatus(401);
    } else {
        console.log(req.query);
        let role;
        if (req.query.companies) {
            role = 'COMPANY';
        } else {
            role = 'USER';
        }
        req.db
            .get('users')
            .find({ role }, { password: 0 })
            .then(users => {
                if (users[0]) {
                    // TODO: Send less data
                    res.json(users);
                } else {
                    res.sendStatus(404);
                }
            });
    }
});

// Block user
router.patch('/api/admin/block/:id', (req, res) => {
    // Check for the current user's role
    if (!req.session.user || req.session.user.role !== 'ADMIN') {
        res.sendStatus(401);
    } else {
        req.db
            .get('users')
            .findOneAndUpdate(
                { id: +req.params.id },
                {
                    $set: {
                        isBlocked: true
                    }
                }
            )
            .then(user => {
                if (!user) {
                    res.sendStatus(404);
                } else {
                    if (user.role === 'COMPANY') {
                        if (user.adverts[0]) {
                            req.db
                                .get('adverts')
                                .update(
                                    { id: { $in: user.adverts } },
                                    { $set: { isBlocked: true } },
                                    { multi: true }
                                )
                                .then(() => {
                                    res.sendStatus(200);
                                });
                        }
                    } else {
                        res.sendStatus(200);
                    }
                }
            });
    }
});

// Unblock user
router.patch('/api/admin/unblock/:id', (req, res) => {
    // Check for the current user's role
    if (!req.session.user || req.session.user.role !== 'ADMIN') {
        res.sendStatus(401);
    } else {
        req.db
            .get('users')
            .findOneAndUpdate(
                { id: +req.params.id },
                {
                    $unset: {
                        isBlocked: ''
                    }
                }
            )
            .then(user => {
                if (!user) {
                    res.sendStatus(404);
                } else {
                    if (user.role === 'COMPANY') {
                        if (user.adverts[0]) {
                            req.db
                                .get('adverts')
                                .update(
                                    { id: { $in: user.adverts } },
                                    { $unset: { isBlocked: '' } },
                                    { multi: true }
                                )
                                .then(() => {
                                    res.sendStatus(200);
                                });
                        }
                    } else {
                        res.sendStatus(200);
                    }
                }
            });
    }
});

/* ––––– CATEGORIES ––––– */

// (Get) Categories
router.get('/api/admin/categories', (req, res) => {
    // Check for the current user's role
    if (!req.session.user || req.session.user.role !== 'ADMIN') {
        res.sendStatus(401);
    } else {
        req.db
            .get('categories')
            .find({}, { sort: { name: 1 } })
            .then(categories => {
                if (categories[0]) {
                    res.json(categories);
                } else {
                    res.sendStatus(404);
                }
            });
    }
});

// Add category
router.post('/api/admin/category', (req, res) => {
    // Check for the current user's role
    if (!req.session.user || req.session.user.role !== 'ADMIN') {
        res.sendStatus(401);
    } else {
        const categories = req.db.get('categories');
        // Get the last document's id
        categories.findOne({}, { sort: { id: -1 } }).then(lastDoc => {
            const id = lastDoc ? ++lastDoc.id : 1;
            if (req.body.name) {
                // Insert the new category
                categories
                    .insert({
                        id,
                        name: req.body.name
                    })
                    .then(doc => {
                        res.json(doc);
                    });
            } else {
                res.sendStatus(400);
            }
        });
    }
});

// Edit category
router.patch('/api/admin/category/:id', (req, res) => {
    // Check for the current user's role
    if (!req.session.user || req.session.user.role !== 'ADMIN') {
        res.sendStatus(401);
    } else {
        if (req.body.name) {
            // Insert the new category
            req.db
                .get('categories')
                .findOneAndUpdate({ id: +req.params.id }, { $set: { name: req.body.name } })
                .then(doc => {
                    res.json(doc);
                });
        } else {
            res.sendStatus(400);
        }
    }
});

// Delete Category
router.delete('/api/admin/category/:id', (req, res) => {
    // Check for the current user's role
    if (!req.session.user || req.session.user.role !== 'ADMIN') {
        res.sendStatus(401);
    } else {
        req.db
            .get('categories')
            .findOneAndDelete({ id: +req.params.id })
            .then(category => {
                res.sendStatus(category ? 200 : 404);
            });
    }
});

/* ––––– ADVERTS ––––– */

// Block advert
router.patch('/api/advert/block/:id', (req, res) => {
    if (!req.session.user || req.session.user.role !== 'ADMIN') {
        res.sendStatus(401);
    } else {
        req.db
            .get('adverts')
            .findOneAndUpdate({ id: +req.params.id }, { $set: { isBlocked: true } })
            .then(() => {
                res.sendStatus(200);
            });
    }
});

module.exports = router;
