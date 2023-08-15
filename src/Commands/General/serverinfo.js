const { EmbedBuilder, ChannelType } = require("discord.js")
module.exports = {
  name: "serverinfo",
  description: "Get information about the server",
  aliases: ['server', 'guild', 'guildinfo'],
  deleteTrigger: true,
  category: "General",
  run: async (client, message, args) => {
    const serverinfoEmbed = new EmbedBuilder()
      .setTitle(`Server Infomation`)
      .setThumbnail(message.guild.iconURL())
      .setFooter({
        text: `Requested by ${message.member.user.tag}`,
        iconURL: `${message.member.displayAvatarURL()}`,
      })
      .setTimestamp()
      .setAuthor({
        name: `${message.guild.name}`,
        iconURL: `${message.guild.iconURL()}`
      })
      .setColor("#a8f1b0")
      .addFields(
        {
          name: 'Server Name',
          value: `${message.guild.name}`,
          inline: true,
        },
        { name: 'Server ID', value: `${message.guild.id}`, inline: true },
        {
          name: 'Server Owner',
          value: `<@!${message.guild.ownerId}>`,
          inline: true,
        },
        {
          name: 'Total Members',
          value: `${message.guild.members.cache.size}`,
          inline: true,
        },
        {
          name: 'Total Bots',
          value: `${message.guild.members.cache.filter(member => member.user.bot).size
            }`,
          inline: true,
        },
        {
          name: 'Total Emojis',
          value: `${message.guild.emojis.cache.size}`,
          inline: true,
        },
        {
          name: 'Animated Emojis',
          value: `${message.guild.emojis.cache.filter(emoji => emoji.animated).size
            }`,
          inline: true,
        },
        {
          name: 'Total Text Channels',
          value: `${message.guild.channels.cache.filter(
            channel => channel.type === ChannelType.GuildText,
          ).size
            }`,
          inline: true,
        },
        {
          name: 'Total Voice Channels',
          value: `${message.guild.channels.cache.filter(
            channel => channel.type === ChannelType.GuildVoice,
          ).size
            }`,
          inline: true,
        },
        {
          name: 'Created At',
          value: `${message.guild.createdAt.toDateString()} <t:${Math.floor(message.guild.createdAt/1000)}:D> `,
          inline: true,
        },
        {
          name: 'Total Roles',
          value: `${message.guild.roles.cache.size}`,
          inline: true,
        },
        {
          name: 'Total Boosters',
          value: `${message.guild.premiumSubscriptionCount}`,
          inline: true,
        },
      )
    message.channel.send({ embeds: [serverinfoEmbed] });
  }
}