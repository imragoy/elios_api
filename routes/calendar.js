var express   = require('express');
var router    = express.Router();
var jwt         = require('jsonwebtoken');

var Events     = require('../models/event');

//TODO : Gestion de chaque champ (date =/= text)
//TODO : Pleins de trucs diffs pour les différentes recherches
//TODO : ajout et gestion des clients
//TODO : Gestion d'erreur
//TODO : Tests
//TODO : Fichiers osef pour l'instant on verra plus tard

/* GET home page. */
router.get('/', function(req, res, next) {
    Events.find({}, function(err, events) {
      res.render('calendar', { title: 'Calendar', events: events });
    });
});

/* POST find events for a special user. */
router.post('/user', function(req, res, next) {
  Events.find({firstName: req.body.firstnametofind, lastName: req.body.lastnametofind},
  function(err, event) {
    if (err) throw err;
    if (!event) {
      console.log("We couldn't find any event for " + req.body.firstnametofind + " " + req.body.lastnametofind + ".");
      res.redirect('/calendar');
    } else {
      console.log(event)
      res.render('calendar', {title: 'Calendar for user ' + req.body.firstnametofind + " " + req.body.lastnametofind, events: event});
    }
  });
});

/* POST find events for a special date. */
router.post('/date', function(req, res, next) {
  Events.find({date: req.body.datetofind},
  function(err, event) {
    if (err) throw err;
    if (!event) {
      console.log("We couldn't find any event for the date : " + req.body.datetofind + ".");
      res.redirect('/calendar');
    } else {
      console.log(event)
      res.render('calendar', {title: 'Calendar for date ' + req.body.datetofind, events: event});
    }
  });
});

/* POST add a new event */
router.post('/addevent', function(req, res) {
  var e = new Events({
    date: req.body.date,
    firstName: req.body.firstname,
    lastName: req.body.lastname,
    eventName: req.body.eventname,
    eventAdress: req.body.adress,
    eventFiles: req.body.files,
  });
  console.log(e);
  e.save(function(err) {
    if (err) throw err;
    else console.log("Event " + req.body.eventname + " saved successfully");
    res.redirect('/calendar');
  });
});

/* POST delete an event with name */
router.post('/deleteevent', function(req, res) {
  Events.findOne({eventName: req.body.name},
  function(err, event) {
    if (err) throw err;
    if (!event) {
      console.log("We couldn't find the event " + req.body.name + ".");
      res.redirect('/calendar');
    } else {
      var query = Events.remove({eventName: req.body.name});
      query.exec();
      console.log("Event " + req.body.name + " has been deleted.");
      res.redirect('/calendar');
    }
  });
});

module.exports = router;
