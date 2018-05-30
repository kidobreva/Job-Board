const express = require('express');
const router = express.Router();

// Get search data
router.get('/api/search-data', (req, res) => {
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

// Search adverts
router.post('/api/adverts', (req, res) => {
    const searchBody = req.body; // the received data from the client
    console.log('Search Adverts:', searchBody);

    // Search from the Home page
    if (searchBody.search) {
        delete searchBody.search;

        // Include only fields which have a value
        const idFields = ['categoryId', 'cityId', 'levelId', 'typeId'];
        idFields.forEach(prop => {
            if (searchBody[prop]) {
                // make sure to convert the id string to a number
                searchBody[prop] = { $in: searchBody[prop].split(',').map(id => +id) };
            }
        });

        // salary
        if (searchBody.salary) {
            const salary = searchBody.salary.split(',').map(id => +id);
            searchBody['salary.min'] = { $gte: salary[0] };
            searchBody['salary.max'] = { $lte: salary[1] };
            delete searchBody.salary;
        }
    }

    // Remove the id when the search is for a specific company
    if (searchBody.id) {
        delete searchBody.id;
    }

    // Keep some needed properties for pagination
    const page = searchBody.page || 1;
    const itemsOnPage = searchBody.size;
    delete searchBody.page;
    delete searchBody.size;

    // The keywords are used for searching in the title and the description
    if (searchBody.keywords) {
        // use case-insensitive regex
        const regex = { $regex: searchBody.keywords, $options: 'i' };
        searchBody['$or'] = [{ title: regex }, { description: regex }];
        delete searchBody.keywords;
    }

    // When searching for adverts, this array is the same as the query in the client's url
    const queryArr = [];
    // Prepare the fields for the database search
    Object.keys(searchBody).forEach(prop => {
        // TODO: make the '0' string more meaningful
        if (!searchBody[prop] || searchBody[prop] === '0') {
            // '0' means that the user has chosen to look for "all", which is an empty value
            // Delete all empty properties
            delete searchBody[prop];
        } else {
            // If the property should be a number, convert it
            queryArr.push({
                [prop]: !isNaN(searchBody[prop]) ? +searchBody[prop] : searchBody[prop]
            });
        }
    });
    console.log('Search Query', queryArr);

    // Choose what the search will be for, based on the page type
    let search;
    if (searchBody.favourites) {
        // user's favourites
        search = { id: { $in: searchBody.favourites } };
    } else if (searchBody.applied) {
        // user's applied
        search = { id: { $in: searchBody.applied } };
    } else {
        // search query (and company)
        search = { $and: queryArr[0] ? queryArr : [{}] };
    }

    // Make sure to not send expired adverts
    search.expirationDate = { $gt: Date.now() };

    // Make sure to not send blocked adverts
    search.isBlocked = { $exists: false };

    // Exclude fields to send less data
    const fields = {
        _id: 0,
        description: 0,
        levelId: 0,
        typeId: 0,
        views: 0
    };

    // Find the adverts in the database
    console.log('Find adverts:', search);
    req.db
        .get('adverts')
        // First sort them by payment type and then by id
        .find(search, { fields, sort: { paymentId: 1, id: -1 } })
        .then(advertsArr => {
            if (advertsArr[0]) {
                // make sure to send only the candidates length istead of the array itself to send less data
                advertsArr.forEach(advert => {
                    advert.candidates = advert.candidates.length;
                });
                // Send the results
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
