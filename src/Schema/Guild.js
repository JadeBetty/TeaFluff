const {Schema, model} = require('mongoose');

const GuildData = new Schema({
  channel: String,
  guild: String,
  case: {type: Number, default: 0},
  prefix: {type: String, default: "."},
  tags: {type: Array, default: []},
  cases: {type: Array, default: []}
});

module.exports.GuildData = model('Guild_Data', GuildData);