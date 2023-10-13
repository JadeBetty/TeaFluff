const {Schema, model} = require('mongoose');

const knownErrors = new Schema({
    error: String
});

module.exports = model('Errors_Data', knownErrors);