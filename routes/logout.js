var express = require('express');
var router = express.Router();

router.get('/logout', function(req, res, next) {
    req.session.destroy(function (err) {
        if (err) {
            res.sendStatus(500);
            res.json({err: err});
        } else {
            res.sendStatus(200);
        }
    });
});

module.exports = router;
