var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/shortly');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to Shortly mongoDB');
});

var Schema = mongoose.Schema;

var urls = new Schema({
  url: String,
  baseUrl: String,
  code: String,
  title: String,
  visits: Number,
  timestamp: Date
});

var users = new Schema({
  username: {
    type: String,
    unique: true
  },
  password: String,
  timestamp: Date
});

var User = mongoose.model('User', users);
var Urls = mongoose.model('Urls', urls);


module.exports = db;
module.exports = User;
module.exports = Urls;
