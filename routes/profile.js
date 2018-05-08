var express = require('express');
var router = express.Router();

// Profile GET
router.get('/profile', function(req, res, next) {
  if (req.session.user) {
    res.json(req.session.user);
  } else {
    res.sendStatus(401);
  }
});

module.exports = router;
