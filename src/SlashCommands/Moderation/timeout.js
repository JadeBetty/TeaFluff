const { SlashCommandBuilder, EmbedBuilder, ChannelType, PermissionFlagsBits } = require('discord.js')
const GuildSchema = require("../../Schema/Guild").GuildData;
module.exports = {
    category: "Moderation",
    data: new SlashCommandBuilder()
        .setName('timeout')
        .setDescription('Time out a specfic user')
        .addUserOption(option => option
            .setName("member")
            .setDescription("Member to timeout")
            .setRequired(true))
        .addStringOption(option => option
            .setName("duration")
            .setDescription("Duration for timeout")
            .setRequired(true)
            .setAutocomplete(true))
        .addStringOption(option => option
            .setName("reason")
            .setDescription("Reason for timeout, if any."))
        .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers),
    async autocomplete(interaction, client) {
        const timeoutOptions = ["5 seconds", "60 seconds", "5 mins", "10 mins", "1 hour", "1 day", "1 week"];
        const focused = await interaction.options.getFocused(true);
        if (!focused) return interaction.respond({
            name: timeoutOptions.map(choice => ({ name: choice, value: choice })),
            value: timeoutOptions.map(choice => ({ name: choice, value: choice }))
        })
        const filter = timeoutOptions.filter(word => word.startsWith(focused.value)).map(choice => ({ name: choice, value: choice }));
        return interaction.respond(filter)
    },
    async run(client, interaction) {
        const { default: ms } = await import("ms");
        const member = await interaction.options.getMember("member");
        const reason = await interaction.options.getString("reason") || "No reason provided.";
        const timeoutDuration = await interaction.options.getString("duration");
        const timeoutDurationMS = ms(timeoutDuration);
        const Guild = await GuildSchema.findOne({ guild: interaction.guild.id })
        if (timeoutDurationMS < 5000 || timeoutDurationMS > 2.419e9) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Invalid Timeout Duration")
                        .setDescription("Time out duration cannot be less than 5 seconds or more then 28 days.")
                        .setColor("#f09999")
                ], ephemeral: true
            })
        }
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`${member.user.tag} has been timeouted`)
                    .setColor("#f09999")
            ]
        })
        await member.timeout(timeoutDurationMS, reason);

        await member.send({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`You has been timeouted from ${interaction.guild.name}!`)
                    .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
                    .addFields(
                        { name: `User`, value: member.user.tag },
                        { name: `Moderator`, value: interaction.user.tag },
                        { name: `Timeouted for`, value: `<t:${Math.round(Date.now() + timeoutDuration / 1000)}:F>` },
                        { name: `Reason`, value: reason }
                    )
                    .setTimestamp()
                    .setColor("#f09999")
            ]
        }).catch(async e => {
            client.errorLogger.send({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("New DiscordAPI encounted")
                        .setDescription(`\`\`\`${e.stack}\`\`\``)
                        .setColor("#f09999")
                ]
            })
            await interaction.followUp({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("User did not get timeouted DM")
                        .setDescription(`${member.user.tag} did not get the timeouted embed DM`)
                        .setColor("#f09999")
                ], ephemeral: true
            })
        });

        let serverCase = Guild.case;
        serverCase++;
        await GuildSchema.updateOne({ guild: interaction.guild.id }, { case: serverCase });
        Guild.cases.push({
            userId: member.user.id,
            reason: reason,
            case: `${serverCase} timeoutAdd`,
            mod: interaction.user.id,
            timestamp: Date.now()
        })
        await GuildSchema.updateOne({ guild: interaction.guild.id }, {
            cases: Guild.cases
        })

        if (!Guild.channel) return;
        const channel = client.channels.cache.get(Guild.channel);
        const msg = await
            channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL() })
                        .setColor("#f09999")
                        .setTimestamp()
                        .addFields(
                            { name: `User`, value: `<@!${member.user.id}> | ${member.user.id} ` },
                            { name: `Moderator`, value: `<@!${interaction.user.id}> | ${interaction.user.id}` },
                            { name: `Case`, value: `${serverCase} | Timeout`, inline: true },
                            { name: `Timeouted for`, value: `${timeoutDuration}`, inline: true },
                            { name: `Expires in`, value: `<t:${Math.round((Date.now() + timeoutDurationMS) / 1000)}:R>`, inline: true },
                            { name: `Reason`, value: `${reason}` }
                        )
                ]
            })
        setTimeout(() => {
            msg.edit({
                embeds: [
                    new EmbedBuilder()
                        .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL() })
                        .setColor("#f09999")
                        .setTimestamp()
                        .addFields(
                            { name: `User`, value: `<@!${member.user.id}> | ${member.user.id} ` },
                            { name: `Moderator`, value: `<@!${interaction.user.id}> | ${interaction.user.id}` },
                            { name: `Case`, value: `${serverCase} | Timeout`, inline: true },
                            { name: `Timeouted for`, value: `${timeoutDuration}`, inline: true },
                            { name: `Expires `, value: `<t:${Math.round((Date.now() + timeoutDurationMS) / 1000)}:R>`, inline: true },
                            { name: `Reason`, value: `${reason}`, inline: true }
                        )
                ]
            })
            channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL() })
                        .setColor("#f09999")
                        .setTimestamp()
                        .addFields(
                            { name: `User`, value: `<@!${member.user.id}> | ${member.user.id} ` },
                            { name: `Moderator`, value: `<@!${interaction.user.id}> | ${interaction.user.id}` },
                            { name: `Case`, value: `${serverCase} | Timeout Expire`, inline: true },
                            { name: `Timeouted for`, value: `${timeoutDuration}`, inline: true },
                            { name: `Expires `, value: `<t:${Math.round((Date.now() + timeoutDurationMS) / 1000)}:R>`, inline: true },
                            { name: `Reason`, value: `${reason}`, inline: true }
                        )
                ]
            })
        }, timeoutDurationMS)
    }
}