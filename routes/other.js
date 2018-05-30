const express = require('express');
const router = express.Router();
const fs = require('fs');
const https = require('https');
const fastXmlParser = require('fast-xml-parser');

// Get news
router.get('/api/news', (req, res) => {
    // https
    //     .get('https://www.regal.bg/rss/?rubrid=429', response => {
    //         // Join the received chunks of data
    //         let data = '';
    //         response.on('data', chunk => {
    //             data += chunk;
    //         });
    //         response.on('end', () => {
    //             // Validate the received xml and send it
    //             let xml;
    //             if (fastXmlParser.validate((xml = data))) {
    //                 res.send(fastXmlParser.parse(xml));
    //             } else {
    //                 res.sendStatus(500);
    //             }
    //         });
    //     })
    //     // If no data is received, use local file
    //     .on('error', () => {
            fs.readFile('data/news.xml', 'utf8', function(err, xml) {
                if (err) {
                    res.sendStatus(500);
                }
                res.send(fastXmlParser.parse(xml));
            });
    //     });
});

// Get news
router.get('/api/partners', (req, res) => {
    req.db.get('partners').find().then(partnersArr => {
        if (partnersArr[0]) {
            res.json(partnersArr);
        } else {
            res.sendStatus(410);
        }
    });
});

module.exports = router;
