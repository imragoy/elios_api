var express = require('express');
var Client = require('ftp');
var router = express.Router();

//partir de la, créer un serveur ftp puis s'y connecter
//trouver nas avec api pour join 

/* GET home page. */
router.get('/', function(req, res, next) {
  var c = new Client();
  var files = [];
  c.on('ready', function() {
    c.list(function(err, list) {
      if (err) throw err;
      files = list;
      res.render('fileResearch', { title: 'Elios Drive', files: files});
      c.end();
    });
  });
  c.connect();
});

router.post('/search', function(req, res, next) {
  var files = [];
  files.push(req.body.filename);
  res.render('fileResearch', { title: 'Elios Drive', files: files});
});

module.exports = router;
