const { SlashCommandBuilder, EmbedBuilder, Client, PermissionsBitField, PermissionFlagsBits } = require('discord.js');
const {userCache} = require('../../utils/Cache');
const moment = require('moment');
const status = {
  online: 'Online',
  idle: 'Idle',
  dnd: 'Do Not Disturb', 
  offline: 'Offline/Invisible',
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('Check a user information')
        .addUserOption(option => option
            .setName("user")
            .setDescription("User that you want to check")
            .setRequired(false)),
    async run(client, interaction) {
        let permissions = []
        let acknowledgements = "";

        const member = await interaction.options.getMember("user") || await interaction.member
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
      
          if (member.permissions.has('ManageInteractions')) {
            permissions.push('Manage interactions');
          }
      
          if (member.permissions.has('MangeChannels')) {
            permissions.push('Manage Channels');
          }
      
          if (member.permissions.has('MentionEveryone')) {
            permissions.push('Mention Everyone');
          }
      
          if (member.permissions.has('MangeNicknames')) {
            permissions.push('Manage Nicknames');
          }
      
          if (member.permissions.has('ManageRoles')) {
            permissions.push('Manage Roles');
          }
      
          if (member.permissions.has('MangeWebhooks')) {
            permissions.push('Manage Webhooks');
          }
      
          if (member.permissions.has('ManageEmojisAndStickers')) {
            permissions.push('Manage Emojis');
          }
      
          if (permissions.length == 0) {
            permissions.push('No Key Permissions Found');
          }
      
          if (member.id == interaction.guild.ownerId) {
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
          const embed = new EmbedBuilder()
          .setDescription(`<@${interaction.user.id}>`)
          .setAuthor({
            name: interaction.user.tag,
            iconURL: interaction.user.displayAvatarURL()
          })
          .setColor(randomColor)
          .setFooter({
            text: `ID: ${interaction.user.id}`
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
                value: `${moment(interaction.member.createdAt).format(
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
                name: `Roles [${
                    member.roles.cache
                      .filter(r => r.id !== interaction.guild.id)
                      .map(roles => `\`${roles.name}\``).length
                  }]`,
                value: `${
                    member.roles.cache
                      .filter(r => r.id !== interaction.guild.id)
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
                value: userCache.has(member.id)
                ? userCache.get(member.id).thanks
                  ? `${userCache.get(member.id).thanks}`
                  : '0'
                : '0',
                inline: true
            },

          )
          .setThumbnail(member.displayAvatarURL());
          interaction.reply({embeds: [embed]})
    }
}