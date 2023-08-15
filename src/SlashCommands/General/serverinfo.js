const { SlashCommandBuilder, EmbedBuilder, ChannelType } = require('discord.js');

module.exports = {
    category: "General",
    data: new SlashCommandBuilder()
        .setName('serverinfo')
        .setDescription('Get information about the server'),
    async run(client, interaction) {
        interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setTitle(`Server Infomation`)
                .setThumbnail(interaction.guild.iconURL())
                .setTimestamp()
                .setAuthor({
                  name: `${interaction.guild.name}`,
                  iconURL: `${interaction.guild.iconURL()}`
                })
                .setColor("#a8f1b0")
                .addFields(
                  {
                    name: 'Server Name',
                    value: `${interaction.guild.name}`,
                    inline: true,
                  },
                  { name: 'Server ID', value: `${interaction.guild.id}`, inline: true },
                  {
                    name: 'Server Owner',
                    value: `<@!${interaction.guild.ownerId}>`,
                    inline: true,
                  },
                  {
                    name: 'Total Members',
                    value: `${interaction.guild.members.cache.size}`,
                    inline: true,
                  },
                  {
                    name: 'Total Bots',
                    value: `${interaction.guild.members.cache.filter(member => member.user.bot).size
                      }`,
                    inline: true,
                  },
                  {
                    name: 'Total Emojis',
                    value: `${interaction.guild.emojis.cache.size}`,
                    inline: true,
                  },
                  {
                    name: 'Animated Emojis',
                    value: `${interaction.guild.emojis.cache.filter(emoji => emoji.animated).size
                      }`,
                    inline: true,
                  },
                  {
                    name: 'Total Text Channels',
                    value: `${interaction.guild.channels.cache.filter(
                      channel => channel.type === ChannelType.GuildText,
                    ).size
                      }`,
                    inline: true,
                  },
                  {
                    name: 'Total Voice Channels',
                    value: `${interaction.guild.channels.cache.filter(
                      channel => channel.type === ChannelType.GuildVoice,
                    ).size
                      }`,
                    inline: true,
                  },
                  {
                    name: 'Created At',
                    value: `${interaction.guild.createdAt.toDateString()} <t:${Math.floor(interaction.guild.createdAt/1000)}:D>`,
                    inline: true,
                  },
                  {
                    name: 'Total Roles',
                    value: `${interaction.guild.roles.cache.size}`,
                    inline: true,
                  },
                  {
                    name: 'Total Boosters',
                    value: `${interaction.guild.premiumSubscriptionCount}`,
                    inline: true,
                  },
                )
            ]
        })
    }
}