const express = require('express');
const router = express.Router();

// Get search data
router.get('/api/search-data', (req, res) => {
    console.log('Get search data', req.query);
    const options = {
        fields: { _id: 0 },
        sort: { id: 1 }
    };
    (async function() {
        res.json({
            categories: await req.db.get('categories').find({}, options),
            cities: await req.db.get('cities').find({}, options),
            levels: await req.db.get('levels').find({}, options),
            payments: await req.db.get('payments').find({}, options),
            types: await req.db.get('types').find({}, options)
        });
    })();
});

// Search my adverts
router.get('/api/my-adverts/search', (req, res) => {
    console.log('Search Adverts:', req.query);
    if (req.query.companyId) {
        req.query.companyId = +req.query.companyId;
    }
    const fields = {
        _id: 0,
        cityId: 1,
        company: 1,
        categoryId: 1,
        candidates: 1,
        img: 1,
        typeId: 1,
        levelId: 1,
        salary: 1,
        title: 1,
        paymentId: 1,
        id: 1,
        date: 1
    };
    const adverts = req.db.get('adverts');
    adverts
        .find({ companyId: req.query.companyId }, { fields, sort: { id: -1 } })
        .then(advertsArr => {
            const len = advertsArr.length;
            if (len) {
                console.log('Adverts:', advertsArr);
                res.json({
                    adverts: advertsArr.slice(
                        (+req.query.page - 1) * +req.query.size,
                        +req.query.page * +req.query.size
                    ),
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

        // TODO - store these in strings
        if (req.query.city) {
            req.query.city = +req.query.city;
        }
        if (req.query.category) {
            req.query.category = +req.query.category;
        }
        if (req.query.level) {
            req.query.level = +req.query.level;
        }
        if (req.query.type) {
            req.query.type = +req.query.type;
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

module.exports = router;
