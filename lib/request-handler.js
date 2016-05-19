var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');

var db = require('../app/config');
var User = require('../app/models/user');
var Link = require('../app/models/link');


exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function() {
    res.redirect('/login');
  });
};

exports.fetchLinks = function(req, res) {
  Link.findAllLinks(function(links) {
    res.status(200).send(links);
  });
};

exports.saveLink = function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.sendStatus(404);
  }

  // query the database to find link
  // if found, return it
  // else 
    // validate the url
    // create the url
    //save it to the db
    // respond with new url instance

  Link.findLink(uri, (found) => {
    if (found) {
      console.log('this is found', found);
      console.log('found attrs', found.attributes);
      res.status(200).send(found);
    } else {
      util.getUrlTitle(uri, function(err, title) {
        if (err) {
          console.log('Error reading URL heading: ', err);
          return res.sendStatus(404);
        }
        Link.makeLink({
          url: uri,
          title: title,
          baseUrl: req.headers.origin
        }).save()
        .then((newLink) => {
          console.log('newlink:', newLink);

          res.status(200).send(newLink);
        });
      });
    }
  });
};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.comparePassword(password, username, function(match) {
    if (match) {
      util.createSession(req, res, username);
    } else {
      res.redirect('/login');
    }
  });
};

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

//check if user exists, if so return user else make new user

  User.findUser(username, (user) => {
    if (!user) {
      User.makeUser({
        username: username,
        password: password
      })
      .save()
      .then(function(newUser) {
        util.createSession(req, res, newUser);
      });
    } else {
      console.log('Account already exists');
      res.redirect('/signup');
    }
  });
};

exports.navToLink = function(req, res) {
  Link.incVisits(req.params[0], function(link) {
    if (!link) {
      res.redirect('/');
    } else {
      res.redirect(link.get('url'));
    }
  });
};