var express     = require('express');
var router      = express.Router();
var jwt         = require('jsonwebtoken');

var User = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
    User.find({}, function(err, users) {
      res.render('users', { title: 'LIST OF USERS', users:users });
    });
  });

router.post('/adduser', function(req, res) {
  var u = new User({
    email: req.body.email,
    password: req.body.password,
    admin: req.body.admin,
    firstName: req.body.firstname,
    lastName: req.body.lastname,
  });
  if (!u.admin) u.admin = false;
  console.log(u);
  u.save(function(err) {
    if (err) throw err;
    else console.log("User " + req.body.firstName + " " + req.body.lastName + " saved successfully");
    res.redirect('/users');
  });
});

router.post('/deleteuser', function(req, res) {
  User.findOne({email: req.body.email},
  function(err, user) {
    if (err) throw err;
    if (!user) {
      console.log("We couldn't find the user " + req.body.firstName + " " + req.body.lastName + ".");
      res.redirect('/users');
    } else {
      var query = User.remove({email: req.body.email});
      query.exec();
      console.log("User " + req.body.firstName + " " + req.body.lastName + " has been deleted.");
      res.redirect('/users');
    }
  });
});

module.exports = router;
