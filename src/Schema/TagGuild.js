const { Schema, model} = require("mongoose");
const tagSchema = new Schema({
    guild: String,
    channel: String,
    tagmodule: {type: Boolean, default: false}
})

module.exports = model("TagGuild", tagSchema)
