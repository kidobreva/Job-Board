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
// router.get('/api/my-adverts/search', (req, res) => {
//     console.log('Search Adverts:', req.query);
//     if (req.query.companyId) {
//         req.query.companyId = +req.query.companyId;
//     }
//     const fields = {
//         _id: 0,
//         cityId: 1,
//         company: 1,
//         categoryId: 1,
//         candidates: 1,
//         img: 1,
//         typeId: 1,
//         levelId: 1,
//         salary: 1,
//         title: 1,
//         paymentId: 1,
//         id: 1,
//         date: 1
//     };
//     const adverts = req.db.get('adverts');
//     adverts
//         .find({ companyId: req.query.companyId }, { fields, sort: { id: -1 } })
//         .then(advertsArr => {
//             const len = advertsArr.length;
//             if (len) {
//                 console.log('Adverts:', advertsArr);
//                 res.json({
//                     adverts: advertsArr.slice(
//                         (+req.query.page - 1) * +req.query.size,
//                         +req.query.page * +req.query.size
//                     ),
//                     len
//                 });
//             } else {
//                 res.sendStatus(404);
//                 console.log('No adverts!');
//             }
//         });
// });

// Search adverts
router.post('/api/adverts/:page', (req, res) => {
    console.log('Search Adverts:', req.body);

    const page = req.params.page;
    const itemsOnPage = req.body.size;
    delete req.body.size;
    if (req.body.keywords) {
        req.body.title = { $regex: req.body.keywords, $options: 'i' };
        delete req.body.keywords;

        // advanced search
        if (req.body.advanced) {
            req.body.description = req.body.title;
            delete req.body.advanced;
            delete req.body.title;
        }
    }

    // prepare properties
    const queryArr = [];
    Object.keys(req.body).forEach((prop, i) => {
        if (!req.body[prop] || req.body[prop] === '0') {
            delete req.body[prop];
        } else {
            queryArr[i] = { [prop]: !isNaN(req.body[prop]) ? +req.body[prop] : req.body[prop] };
        }
    });
    console.log('Query', queryArr);

    let search;
    const query = {
        adverts: { $and: queryArr[0] ? queryArr : [{}] },
        favourites: { id: { $in: req.body.favourites } },
        applied: { id: { $in: req.body.applied } }
    };
    if (req.body.favourites) {
        search = query.favourites;
    } else if (req.body.applied) {
        search = query.applied;
    } else {
        search = query.adverts;
    }
    const adverts = req.db.get('adverts');
    adverts.find(search, { sort: { paymentId: 1, id: -1 } }).then(advertsArr => {
        if (advertsArr[0]) {
            res.json({
                adverts: advertsArr.slice(
                    (page - 1) * (itemsOnPage || 5),
                    page * (itemsOnPage || 5)
                ),
                totalAdverts: advertsArr.length
            });
        } else {
            res.sendStatus(404);
        }
    });
});

module.exports = router;
