const {Schema, model} = require('mongoose');

const ChatBot = new Schema({
    role: String,
    content: String,
    name: String,
});

module.exports = model('ChatBot_Data', ChatBot);