const { SlashCommandBuilder, EmbedBuilder, ChannelType, PermissionFlagsBits } = require('discord.js')
const GuildSchema = require("../../Schema/Guild").GuildData;
module.exports = {
    category: "Moderation",
    data: new SlashCommandBuilder()
        .setName('warn')
        .setDescription('Warn a specfic user')
        .addUserOption(option => option
            .setName("member")
            .setDescription("Member to warn")
            .setRequired(true))
        .addStringOption(option => option
            .setName("reason")
            .setDescription("Reason for warn, if any."))
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
    async run(client, interaction) {
        const guild = await GuildSchema.findOne({ guild: interaction.guild.id });
        const member = interaction.options.getMember("member");
        const reason = interaction.options.getString("reason") || "No reason provided.";
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setTitle(`${member.user.tag} has been warned!`)
                .setColor("#a8f1b0")
            ], ephemeral: true
        })
        let newCase = guild.case;
        newCase++;
        await GuildSchema.updateOne({ guild: interaction.guild.id }, { case: newCase });

        member.send({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`You has been warned from ${interaction.guild.name}!`)
                    .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
                    .addFields(
                        { name: `User`, value: member.user.tag },
                        { name: `Moderator`, value: interaction.user.tag },
                        { name: `Case`, value: `${newCase}` },
                        { name: `Reason`, value: reason },
                    )
                    .setTimestamp()
                    .setColor("#f09999")
            ],
        }).catch(async e => {
            client.errorLogger.send({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("New DiscordAPI Error encounted")
                        .setDescription(`\`\`\`${e}\`\`\``)
                        .setColor("#f09999")
                ]
            })
        })
        guild.cases.push({
            userId: member.user.id,
            reason: reason,
            case: `${newCase} warnAdd`,
            mod: interaction.user.id,
            timestamp: Math.round(Date.now() / 1000)
        })
        await GuildSchema.updateOne({ guild: interaction.guild.id }, { cases: guild.cases })
        const channelLog = client.channels.cache.get(guild.channel);
        if (!channelLog) return;
        channelLog.send({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL() })
                    .setColor("#f09999")
                    .setTimestamp()
                    .addFields(
                        { name: `User`, value: `<@!${member.user.id}> | ${member.user.id} ` },
                        { name: `Moderator`, value: `<@!${interaction.user.id}> | ${interaction.user.id}` },
                        { name: `Case`, value: `${newCase} | Warn` },
                        { name: `Reason`, value: `${reason}` }
                    )
            ]
        })
    }
}