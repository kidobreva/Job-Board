var express = require('express');
var router = express.Router();

router.delete('/advert/:id', function(req, res, next) {
  console.log('Advert Delete:', req.params);

  req.db
      .get('adverts')
      .findOneAndDelete({id: +req.params.id})
      .then(function(advert) {
          if (advert) {
              console.log('Advert Deleted:', advert);
              res.sendStatus(200);
          } else {
            res.sendStatus(404);
          }
      }).catch (function (err) {
        console.log(err);
      });
});

module.exports = router;
