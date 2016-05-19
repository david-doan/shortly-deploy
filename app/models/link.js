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



module.exports = makeLink;
