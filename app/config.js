var crypto = require('crypto');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/shortly');
var con = mongoose.connection;
con.on('error', console.error.bind(console, 'connection error:'));
con.once('open', function() {
  console.log('Connected to Shortly mongoDB');
});

var Schema = mongoose.Schema;

var urlsSchema = new Schema({
  url: String,
  baseUrl: String,
  code: String,
  title: String,
  visits: Number,
  timestamp: Date
});

var usersSchema = new Schema({
  username: {
    type: String,
    unique: true
  },
  password: String,
  timestamp: Date
});





var userModel = mongoose.model('User', usersSchema);
var urlModel = mongoose.model('Urls', urlsSchema);




exports.con = con;
exports.userModel = userModel;
exports.urlModel = urlModel;
