const { EmbedBuilder } = require("discord.js");
const imports = require("../../imports/embed");
module.exports = {
    name: "embed",
    description: "Create and send embeds in a specific channel",
    category: "Moderation",
    run: async (client, message, args) => {
        const channel = message.mentions.channels.first() || client.channels.cache.get(args[0]);
        if(!channel) {
            return message.channel.send({
                embeds: [
                    imports.NCH
                ]
            })
        }
        message.channel.send({
            embeds: [
                imports.EE
            ]
        })
    }
}