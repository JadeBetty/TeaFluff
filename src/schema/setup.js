const {Schema, model} = require('mongoose');

const modmailSetup = new Schema({
    channel: String,
    category: String,
    guildId: String,
});

module.exports = model('setupmodmail', modmailSetup);