var db = require('../config');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');
var mongoose = require('mongoose');

// var User = db.Model.extend({
//   tableName: 'users',
//   hasTimestamps: true,
//   initialize: function() {
//     this.on('creating', this.hashPassword);
//   },
//   comparePassword: function(attemptedPassword, callback) {
//     bcrypt.compare(attemptedPassword, this.get('password'), function(err, isMatch) {
//       callback(isMatch);
//     });
//   },
//   hashPassword: function() {
//     var cipher = Promise.promisify(bcrypt.hash);
//     return cipher(this.get('password'), null, null).bind(this)
//       .then(function(hash) {
//         this.set('password', hash);
//       });
//   }
// });

var comparePassword = function(attemptedPassword, username, cb) {
  db.userModel.findOne({'username': username})
  .select('password')
  .then( (data) => {
    console.log(data, '< PROMISE?');
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

// console.log(comparePassword('123', 'joe'));
// var test = makeUser({
//   username: 'joe',
//   password: '123'
// });

// test.save((err) =>{
//   if (err) { return console.error(err); }
//   console.log('Success made new user!');
// });




exports.makeUser = makeUser;
exports.comparePassword = comparePassword;
