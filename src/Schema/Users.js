const {Schema, model} = require('mongoose');

const UserType = new Schema({
  id: String,
  thanks: Number,
  wordleWins: Number,
  key: String
});

module.exports = model('User_Storage', UserType);