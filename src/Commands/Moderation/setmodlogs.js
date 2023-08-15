const { EmbedBuilder } = require('discord.js');
const GuildSchema = require("../../Schema/Guild").GuildData

module.exports = {
    name: 'modlog',
    category: 'Moderation',
    deleteTrigger: true,
    permissions: ["Administrator"],
    description: 'Set a channel for moderation log',
    aliases: ['setmoderationlog', 'sml', "setmodlogs"],
    run: async (client, message, args) => {
        let channel = message.mentions.channels.first() || client.channels.cache.get(args[0]);
        if (!channel) return message.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Invalid Usage!")
                    .addFields(
                        { name: `Usage`, value: `${guild.prefix}modlog #channel` }
                    )
                    .setColor("#f09999")
            ]
        })
        await GuildSchema.findOneAndUpdate({ guild: message.guild.id }, { channel: channel.id });
        return message.channel.send({
            embeds: [
                new EmbedBuilder()
                .setDescription(`Successfully changed server moderation channel logs to ${channel}!`)
                .setColor("#a8f1b0")
            ]
        })
    },
}
