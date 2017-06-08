let mongoose = require('mongoose');

let userSchema = mongoose.Schema({
  facebookId: String,
  firstName: String
});

let User = mongoose.model('User', userSchema);

module.exports = User;