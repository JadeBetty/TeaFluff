const { EmbedBuilder } = require('discord.js');
let mlog = require("../../Schema/Guild").GuildData

module.exports = {
    name: 'setmodlog',
    category: 'Moderation',
    deleteTrigger: true,
    permissions: ["Administrator"],
    description: 'Set a channel for moderation log',
    aliases: ['setmoderationlog', 'sml', "setmodlogs"],
    run: async (client, message, args) => {
        let channel = message.mentions.channels.first() || client.channels.cache.get(args[0]);
        if (!channel) return message.channel.send("Please mention a channel for the moderation log!")
        let c = await mlog.findOne({ guild: message.guild.id });
        if (!c) {
            c = await mlog.create({
                guild: message.guild.id,
                channel: channel.id
            }
            );
            await c.save();
        } else {
            await mlog.findOneAndUpdate({
                guild: message.guild.id,
            }, {
                channel: channel.id
            })
        }
        message.channel.send({ content: `This server moderation log channel has set to ${channel}` })
    },
}