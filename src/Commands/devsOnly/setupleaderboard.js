const { EmbedBuilder } = require("discord.js");
const { GuildData } = require('../../schema/guild');
const { guildCache } = require('../../utils/Cache');
const config = require("../../../config.json")
module.exports = {
    name: 'setuplb',
    category: 'owner',
    devOnly: true,
    description: "Set's up a thanks leaderboard.",
    disabledChannel: [],
    category: 'Owner',
    aliases: ["setlb"],
    run: async (client, message, args) => {
        const notowner = new EmbedBuilder()
            .setDescription('Only the developers of cheeku can use this command!')
            .setColor('DarkOrange');

        if (!config.devs.includes(message.author.id))
            return message.channel.send({ embeds: [notowner] });
        // Make sure a channel is provided
        let channel = message.mentions.channels.first();
        if (!channel) {
            return message.channel.send(
                'You need to provide a channel to set the leaderboard to!',
            );
        }
        let mesg = await channel.send({
            embeds: [
                new EmbedBuilder()
                    .setTitle('Thanks Leaderboard')
                    .setDescription(
                        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                            .map(i => `**#${i}.** ??? with \`0\` Thanks.`)
                            .join('\n'),
                    )
                    .setColor('#32a852'),
            ],
        });
        await GuildData.updateOne(
            {
                id: message.guild.id,
            },
            {
                id: message.guild.id,
                leaderboardChannel: channel.id,
                leaderboardMessage: mesg.id,
            },
            { upsert: true },
        );
        let guildA = guildCache.get(message.guild.id) || {
            id: message.guild.id,
        };
        guildA['leaderboardChannel'] = channel.id;
        guildA['leaderboardMessage'] = mesg.id;
        guildCache.set(message.guild.id, guildA);


    }
}