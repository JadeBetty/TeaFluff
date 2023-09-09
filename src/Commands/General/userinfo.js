const { EmbedBuilder, Permissions } = require('discord.js');
const moment = require('moment');
const status = {
    online: 'Online',
    idle: 'Idle',
    dnd: 'Do Not Disturb',
    offline: 'Offline/Invisible',
};

module.exports = {
    name: 'userinfo',
    description: "Get's info of an user.",
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
            if (acknowledgements.length > 0) {
                acknowledgements += ', Server Booster';
            } else {
                acknowledgements = 'Server Booster';
            }
        }
        if (!acknowledgements) {
            acknowledgements = 'None';
        }

        const embed = new EmbedBuilder()
            .setDescription(`<@${member.user.id}>`)
            .setAuthor({
                name: member.user.tag,
                iconURL: member.displayAvatarURL()
            })
            .setColor("#a8f1b0")
            .setFooter({
                text: `ID: ${member.user.id}`
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
                    value: `${moment(member.joinedAt).format("dddd, MMMM do YYYY, HH:mm:ss")}  \n<t:${Math.floor(member.joinedAt/1000)}:R>`,
                    inline: true
                },
                {
                    name: `Created at:`,
                    value: `${moment(member.user.createdAt).format(
                        'dddd, MMMM Do YYYY, HH:mm:ss',
                    )}  \n<t:${Math.floor(member.user.createdAt/1000)}:R> `,
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
                        .join('\n') || 'No Roles'
                        }`,
                    inline: true
                },
                {
                    name: `Acknowledgements`,
                    value: `${acknowledgements}`,
                    inline: true
                },

            )
            .setThumbnail(member.displayAvatarURL());
        message.channel.send({ embeds: [embed] })

    }
}