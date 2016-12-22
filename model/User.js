var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  firstname: String,
  lastname: String,
  userid: String,
});

var User = mongoose.model('User', userSchema);

module.exports = User;