const { Schema, model} = require("mongoose");
const tagSchema = new Schema({
    name: String,
    content: String,
    owner: String,
    createdAt: String,
    guild: String,
    enabled: Boolean,
    verifiedat: String,
    verifiedby: String,
})

module.exports = model("TagSystem", tagSchema)