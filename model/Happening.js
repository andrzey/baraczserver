let mongoose = require('mongoose');

let happeningSchema = mongoose.Schema({
  id: String,
  owner: String,
  title: String,
  place: String,
  time: String,
  description: String,
  comments: [],
  participants: []
});

let Happening = mongoose.model('Happening', happeningSchema);

module.exports = Happening;