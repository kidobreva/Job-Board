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



module.exports = router;
