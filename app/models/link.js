var db = require('../config.js');
var crypto = require('crypto');
var mongoose = require('mongoose');


var shortenUrl = function(url) {
  var shasum = crypto.createHash('sha1');
  shasum.update(url);
  return shasum.digest('hex').slice(0, 5);
};


var makeLink = function(obj) {
  var newLink = new db.urlModel({
    url: obj.url,
    baseUrl: obj.baseUrl,
    title: obj.title,
    visits: 0, //need a way to increment
    timestamp: Date.now()
  });

  newLink.code = shortenUrl(obj.url);

  return newLink;
};

var findLink = (link, cb) => {
  db.urlModel.findOne({url: link})
  .then(data => {
    cb(data);
  });

};

var findAllLinks = (cb) => {
  db.urlModel.find()
  .then(data => {
    cb(data);
  });

};

var incVisits = (code, cb) => {
  db.urlModel.findOneAndUpdate({code: code}, {$inc: {visits: 1}}, {new: true})
  .then( (data) => {
    cb(data);
  });
};


// var test = makeLink({
//   url: 'www.hackreactor.com',
//   baseUrl: 'www.hackreactor.com',
//   title: 'Hack Reactor',
// });

// test.save( (err) => {
//   if (err) {
//     return console.error(err);
//   }
//   console.log('SUCCESS LINK CREATION');
// });



exports.makeLink = makeLink;
exports.findLink = findLink;
exports.findAllLinks = findAllLinks;
exports.incVisits = incVisits;
