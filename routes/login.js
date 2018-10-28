var express     = require('express');
var router      = express.Router();
var jwt         = require('jsonwebtoken');

var User = require('../models/user')

/* GET login page. */
router.get('/', function(req, res, next) {
    res.render('login', { title: 'Elios Drive'});
  });
  
/* === Login : /login === */
router.post('/login', function(req, res) {
    User.findOne({email: req.body.email},
      function(err, user) {
          console.log("searching user")
        if (err) throw err;
        if (!user) {
            console.log("Wrong username");
            res.redirect('/');
        } else if (user) {
            if (user.password != req.body.password) {
                console.log("Wrong password");
                res.redirect('/');
            } else {
                var token = jwt.sign({data: user}, 'eliosdriveflnd0105', {
                expiresIn: 60 * 60 * 24 });
                res.cookie('auth', token);
                res.redirect('/');
            }
        }
    })
});
  
/* === Logout : /login/out === */
router.get('/logout', function(req, res) {
    res.cookie('auth', 0);
    res.redirect('/');
});

module.exports = router;