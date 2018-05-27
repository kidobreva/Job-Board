const express = require('express');
const router = express.Router();

// (Get) Users
router.get('/api/admin/users', (req, res) => {
    if (!req.session.user || req.session.user.role !== 'ADMIN') {
        res.sendStatus(401);
    } else {
        req.db
            .get('users')
            .find({ role: 'USER' }, { password: 0 })
            .then(users => {
                if (users[0]) {
                    res.json(users);
                } else {
                    res.sendStatus(404);
                }
            });
    }
});

// (Get) Statistics
router.get('/api/admin/statistics', (req, res) => {
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
        users.count().then(count => {
            numberOfUsers = count;
            adverts.count().then(count => {
                numberOfAdverts = count;
                categories.count().then(count => {
                    numberOfCategories = count;
                    users.find({ role: 'USER' }).then(users => {
                        numberOfCandidates = users.length;
                        res.json({
                            numberOfUsers,
                            numberOfAdverts,
                            numberOfCategories,
                            numberOfCandidates
                        });
                    });
                });
            });
        });
    }
});

// (DELETE) Advert
router.delete('/api/advert/:id', (req, res) => {
    if (
        !req.session.user &&
        (req.session.user.role === 'ADMIN' || req.session.user.id === req.params.id)
    ) {
        res.sendStatus(401);
    } else {
        req.db
            .get('adverts')
            .findOneAndDelete({ id: +req.params.id })
            .then(advert => {
                if (advert) {
                    console.log('Advert Deleted:', advert);
                    res.sendStatus(200);
                } else {
                    res.sendStatus(404);
                }
            });
    }
});

// (PATCH) Block company
router.patch('/api/company/block/:id', (req, res) => {
    if (!req.session.user && req.session.user.role !== 'ADMIN') {
        res.sendStatus(401);
    } else {
        req.db
            .get('users')
            .findOneAndUpdate({ id: +req.params.id, role: 'COMPANY' }, { $set: req.body })
            .then(company => {
                if (company) {
                    console.log('Company Info:', company);
                    res.json(company);
                } else {
                    res.sendStatus(404);
                }
            });
    }
});

// (PATCH) Block user
router.patch('/api/user/block/:id', (req, res) => {
    if (!req.session.user && req.session.user.role !== 'ADMIN') {
        res.sendStatus(401);
    } else {
        req.db
            .get('users')
            .findOneAndUpdate({ id: +req.params.id, role: 'USER' }, { $set: req.body })
            .then(user => {
                if (user) {
                    console.log('User Info:', user);
                    res.json(user);
                } else {
                    res.sendStatus(404);
                }
            });
    }
});

// (Get) Categories
router.get('/api/admin/categories', (req, res) => {
    if (!req.session.user || req.session.user.role !== 'ADMIN') {
        res.sendStatus(401);
    } else {
        req.db
            .get('categories')
            .find()
            .then(categories => {
                if (categories[0]) {
                    res.json(categories);
                } else {
                    res.sendStatus(404);
                }
            });
    }
});

// (DELETE) Category
router.delete('/api/admin/category/:id', (req, res) => {
    if (!req.session.user && req.session.user.role === 'ADMIN') {
        res.sendStatus(401);
    } else {
        req.db
            .get('categories')
            .findOneAndDelete({ id: +req.params.id })
            .then(category => {
                if (category) {
                    console.log('Category Deleted:', category);
                    res.sendStatus(200);
                } else {
                    res.sendStatus(404);
                }
            });
    }
});

// Add category
router.post('/api/admin/category', (req, res) => {
    console.log('[POST] /api/admin/category:', req.body);

    // Check for the current user's role
    if (!req.session.user || req.session.user.role !== 'ADMIN') {
        res.sendStatus(401);
    } else {
        const categories = req.db.get('categories');
        categories.findOne({}, { sort: { id: -1 } }).then(lastItem => {
            categories
                .insert({
                    id: ++lastItem.id,
                    name: req.body.name
                })
                .then(() => {
                    req.session.save(() => {
                        res.sendStatus(200);
                    });
                });
        });
    }
});

// Edit category
router.patch('/api/admin/category/:id', (req, res) => {
    console.log('[POST] /api/admin/category:', req.body);
    // Check for the current user's role
    if (!req.session.user || req.session.user.role !== 'ADMIN') {
        res.sendStatus(401);
    } else {
        const categories = req.db.get('categories');
        categories
            .findOneAndUpdate({ id: +req.params.id }, { $set: { name: req.body.name } })
            .then(() => {
                res.sendStatus(200);
            });
    }
});

module.exports = router;
