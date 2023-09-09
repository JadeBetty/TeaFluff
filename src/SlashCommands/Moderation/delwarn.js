const { SlashCommandBuilder, EmbedBuilder, ChannelType, PermissionFlagsBits } = require('discord.js')
const GuildSchema = require("../../Schema/Guild").GuildData;
module.exports = {
    category: "Moderation",
    data: new SlashCommandBuilder()
        .setName('delwarn')
        .setDescription('Delete a warning of a specific user')
        .addIntegerOption(option => option
            .setName("case-number")
            .setDescription("Case number of the warning you want to delete.")
            .setRequired(true))
        .addStringOption(option => option
            .setName("reason")
            .setDescription("Reason for warn, if any."))
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
    async run(client, interaction) {
        const guild = await GuildSchema.findOne({ guild: interaction.guild.id });
        const caseNumber = interaction.options.getInteger("case-number");
        const newReason = interaction.options.getString("reason") || "No reason provided.";
        const index = guild.cases.findIndex(c => c.case.toString().startsWith(caseNumber.toString() + ' '));
        if(index === -1) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setTitle("Invalid warning case!")
                .setDescription("The warning case you provided is not in the DataBase")
                .setColor("#f09999")
            ], 
            ephemeral: true
        })
        const theWarningObject = guild.cases[index];
        
        guild.cases.splice(index, 1);
        await GuildSchema.updateOne({ guild: interaction.guild.id }, { cases: guild.cases })
        const user = client.users.cache.get(theWarningObject.userId);
        const oldMod = client.users.cache.get(theWarningObject.mod)
        const oldReason = theWarningObject.reason;
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setTitle(`${user.tag} warning has been deleted!`)
                .setColor("#a8f1b0")
            ]
        })
        user.send({
            embeds: [
                new EmbedBuilder()
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
                    .setDescription(`A warning from ${interaction.guild.name} has been deleted!`)
                    .addFields(
                        { name: `Case`, value: theWarningObject.case },
                        { name: `Moderator`, value: interaction.user.tag },
                        { name: `Reason`, value: newReason },
                        { name: `Old reason`, value: oldReason }
                    )
                    .setTimestamp()
                    .setColor("#f09999")
            ]
        }).catch(err => {
            client.errorLogger.send({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("New DiscordAPI encounted")
                        .setDescription(`\`\`\`${err}\`\`\``)
                        .setColor("#f09999")
                ]
            })
        });
        const channelLog = client.channels.cache.get(guild.channel);
        if(!channelLog) return;
        channelLog.send({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL() })
                    .setColor("#f09999")
                    .setTimestamp()
                    .addFields(
                        { name: `User`, value: `<@!${user.id}> | ${user.id} ` },
                        { name: `Moderator`, value: `<@!${interaction.user.id}> | ${interaction.user.id}` },
                        { name: `Old Moderator`, value: `<@!${oldMod.id}> | ${oldMod.id}` },
                        { name: `Case`, value: `${theWarningObject.case.split(" ")[0]} | Warning Delete` },
                        { name: `Old Reason`, value: `${oldReason}` },
                        { name: `New Reason`, value: `${newReason}` }
                    )
            ]
        })
    }
}