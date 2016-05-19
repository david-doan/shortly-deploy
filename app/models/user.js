var db = require('../config');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');
var mongoose = require('mongoose');



var comparePassword = function(attemptedPassword, username, cb) {
  findUser(username, (data) =>{
    if (data.password === undefined) {
      cb(false);
    } else {
      cb(bcrypt.compareSync(attemptedPassword, data.password)); 
    }
  });    
};

var hashPassword = function(password) {
  return bcrypt.hashSync(password, null);
};

var makeUser = function(obj) {
  var newUser = new db.userModel({
    username: obj.username,
    timestamp: Date.now()
  });

  newUser.password = hashPassword(obj.password);

  return newUser;
};

var findUser = function(username, cb) {
  db.userModel.findOne({username: username})
    .then( (data) => {
      cb(data);
    });
};


exports.makeUser = makeUser;
exports.comparePassword = comparePassword;
exports.findUser = findUser;
