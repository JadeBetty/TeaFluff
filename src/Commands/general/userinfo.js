const { EmbedBuilder, Permissions } = require('discord.js');
const { userCache } = require('../../utils/Cache');
const moment = require('moment');
const UserModel = require("../../schema/user");
//const messageCreate = require('../Events/messageCreate');

const status = {
  online: 'Online',
  idle: 'Idle',
  dnd: 'Do Not Disturb',
  offline: 'Offline/Invisible',
};

module.exports = {
  name: 'userinfo',
  description: "Get's info of a user.",
  aliases: ['info', 'whois', "ui"],
  permissions: [],
  category: 'General',
  disabledChannel: [],
  run: async (client, message, args) => {
    let permissions = []
    let acknowledgements = "";

    const member =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]) ||
      message.member;

    const randomColor = '#000000'.replace(/0/g, function () {
      return (~~(Math.random() * 16)).toString(16);
    });

    if (member.permissions.has('KickMembers')) {
      permissions.push('Kick Members');
    }

    if (member.permissions.has('BanMembers')) {
      permissions.push('Ban Members');
    }

    if (member.permissions.has('Administrator')) {
      permissions.push('Administrator');
    }

    if (member.permissions.has('ManageMessages')) {
      permissions.push('Manage Messages');
    }

    if (member.permissions.has('ManageChannels')) {
      permissions.push('Manage Channels');
    }

    if (member.permissions.has('MentionEveryone')) {
      permissions.push('Mention Everyone');
    }

    if (member.permissions.has('ManageNicknames')) {
      permissions.push('Manage Nicknames');
    }

    if (member.permissions.has('ManageRoles')) {
      permissions.push('Manage Roles');
    }

    if (member.permissions.has('ManageWebhooks')) {
      permissions.push('Manage Webhooks');
    }

    if (member.permissions.has('ManageEmojisAndStickers')) {
      permissions.push('Manage Emojis');
    }

    if (permissions.length == 0) {
      permissions.push('No Key Permissions Found');
    }

    if (member.id == message.guild.ownerId) {
      acknowledgements = 'Server Owner';
    }


    if (member.premiumSince) {
      // If there was an acknowledgement, add a comma
      if (acknowledgements.length > 0) {
        acknowledgements += ', Server Booster';
      } else {
        acknowledgements = 'Server Booster';
      }
    }
    // If no acknowledgement, set it to None
    if (!acknowledgements) {
      acknowledgements = 'None';
    }

    //   let memberstats = status[member.presence.status ?? member.presence.status]
    // console.log(memberstats)
    const wordleWins = await UserModel.findOne({ id: member.id })
    console.log(wordleWins)
    const embed = new EmbedBuilder()
      .setDescription(`<@${member.user.id}>`)
      .setAuthor({
        name: member.user.tag,
        iconURL: member.displayAvatarURL()
      })
      .setColor(randomColor)
      .setFooter({
        text: `ID: ${message.author.id}`
      })
      .setTimestamp()
      .addFields(
        {
          name: `Status`,
          value: `${member.presence === null ? "Offline" : status[member.presence?.status]}`,
          inline: true
        },
        {
          name: `Joined at:`,
          value: `${moment(member.joinedAt).format("dddd, MMMM do YYYY, HH:mm:ss")}`,
          inline: true
        },
        {
          name: `Created at:`,
          value: `${moment(message.author.createdAt).format(
            'dddd, MMMM Do YYYY, HH:mm:ss',
          )}`,
          inline: true
        },
        {
          name: `Permissions:`,
          value: `${permissions.join(", ")}`,
          inline: true
        },
        {
          name: `Roles [${member.roles.cache
              .filter(r => r.id !== message.guild.id)
              .map(roles => `\`${roles.name}\``).length
            }]`,
          value: `${member.roles.cache
              .filter(r => r.id !== message.guild.id)
              .map(roles => `<@&${roles.id}>`)
              .join(' **|** ') || 'No Roles'
            }`,
          inline: true
        },
        {
          name: `Acknowledgements`,
          value: `${acknowledgements}`,
          inline: true
        },
        {
          name: `Thanks`,
          value: `${wordleWins.thanks}`,
          inline: true
        },
        {
          name: `Wordle Wins`,
          value: `${wordleWins.wordleWins || 0}`,
          inline: true,
        },

      )
      .setThumbnail(member.displayAvatarURL());
    message.channel.send({ embeds: [embed] })

  }
}