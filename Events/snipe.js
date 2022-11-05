const { Collection } = require("discord.js");
const client = require("..")
client.snipes = new Collection();

module.exports = {
    event: "messageDelete",
  async run(message) {
    //collect data and add to snipes

    if (message.author?.bot) return;
    client.snipes.set(message.channel.id, {
      message: message.content,
      author: message.author,
      channel: message.channel,
      time: Date.now(),
      attachment: message.attachments?.first()?.url || null,
    });
  },
};