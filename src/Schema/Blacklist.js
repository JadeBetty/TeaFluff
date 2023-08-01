const {Schema, model} = require('mongoose');

const BlackListDataGuild = new Schema({
    guildId: String,
    reason: String,
});

const BLDTUser = new Schema({
    userId: String,
    reason: String,
})


module.exports = model('BLGuild_Data', BlackListDataGuild);

module.exports.bluser = model('BLData_User', BLDTUser);