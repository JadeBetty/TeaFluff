const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const GuildSchema = require("../../Schema/Guild").GuildData;
module.exports = {
    category: "Moderation",
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('kick a specific user')
        .addUserOption(option => option
            .setName("member")
            .setDescription("Member to kick")
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName("reason")
            .setDescription("Reason for kick, if any")),
    async run(client, interaction) {
        const member = interaction.options.getMember("member");
        const Guild = await GuildSchema.findOne({ guild: interaction.guild.id });
        if(!member.kickable) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setTitle("Invalid Permissions!")
                .setDescription(`I'm not authorized to kick ${member}`)
                .setColor("#f09999")
            ],
            ephemeral: true
        })
        const reason = interaction.options.getString("reason") || "No reason provided.";
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setTitle(`${member.user.tag} has been kicked`)
                .setColor("#f09999")
            ]
        })
        await member.send({
            embeds: [
                new EmbedBuilder()
                .setDescription(`You has been kicked from ${interaction.guild.name}!`)
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
                .addFields(
                    { name: `User`, value: member.user.tag },
                    { name: `Moderator`, value: interaction.user.tag },
                    { name: `Reason`, value: reason }
                )
                .setTimestamp()
                .setColor("#f09999")
            ]
        }).catch(async err => {
            client.errorLogger.send({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("New DiscordAPI encounted")
                        .setDescription(`\`\`\`${err.stack}\`\`\``)
                        .setColor("#f09999")
                ]
            })
        });

        await member.kick();
        
        let serverCase = Guild.case;
        serverCase++;
        await GuildSchema.updateOne({ guild: interaction.guild.id }, { case: serverCase });
        Guild.cases.push({
            userId: member.user.id,
            reason: reason,
            case: `${serverCase} warnAdd`,
            mod: interaction.user.id,
            timestamp: Date.now()
        })
        await GuildSchema.updateOne( { guild: interaction.guild.id }, {
            cases: Guild.cases 
        })

        if (!Guild.channel) return;
        const channel = client.channels.cache.get(Guild.channel);
        channel.send({
            embeds: [
                new EmbedBuilder()
                .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL() })
                .setColor("#f09999")
                .setTimestamp()
                .addFields(
                    { name: `User`, value: `<@!${member.user.id}> | ${member.user.id} `},
                    { name: `Moderator`, value: `<@!${interaction.user.id}> | ${interaction.user.id}`},
                    { name: `Case`, value: `${serverCase} | Kick`, inline: true},
                    { name: `Reason`, value: `${reason}`, inline: true}
                )
            ]
        })
    }
}