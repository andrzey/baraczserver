var mongoose = require('mongoose');

var postSchema = mongoose.Schema({
  title: String,
  description: String
});

var Post = mongoose.model('Post', postSchema);

module.exports = Post;