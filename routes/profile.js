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

// Profile POST
router.post('/profile/update/:id', function(req, res, next) {
  console.log('Profile Post:', req.body);

  const users = req.db.get('users');
  users
      .findOne({ id: req.session.user.id })
      .then(function(user) {
          if (user) {
              users.findOneAndUpdate({ id: req.body.id }, req.body);

              // save to session
              req.session.user.img = req.body;
              req.session.save();

              // save to database
              user.img = req.body;
              users.findOneAndUpdate({ id: req.session.user.id }, user);
          } else {
              console.log('No user!');
          }
      })
      .catch(function(err) {
          console.log(err);
      });
});

module.exports = router;
