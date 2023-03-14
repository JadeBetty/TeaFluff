const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const GuildSchema = require("../../Schema/Guild").GuildData;
module.exports = {
    category: "Moderation",
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Ban a specific user')
        .addUserOption(option => option
            .setName("member")
            .setDescription("Member to ban")
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName("reason")
            .setDescription("Reason for ban, if any")),
    async run(client, interaction) {
        const member = interaction.options.getMember("member");
        const Guild = await GuildSchema.findOne({ guild: interaction.guild.id });
        if(!member.kickable) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setTitle("Invalid Permissions!")
                .setDescription(`I'm not authorized to ban ${member}`)
                .setColor("#f09999")
            ],
            ephemeral: true
        })
        const reason = interaction.options.getString("reason") || "No reason provided.";
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setTitle(`${member.user.tag} has been banned`)
                .setColor("#f09999")
            ]
        })
        await member.send({
            embeds: [
                new EmbedBuilder()
                .setDescription(`You has been banned from ${interaction.guild.name}!`)
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

        await member.ban({reason: reason});
        
        let serverCase = Guild.case;
        serverCase++;
        await GuildSchema.updateOne({ guild: interaction.guild.id }, { case: serverCase });
        Guild.cases.push({
            userId: member.user.id,
            reason: reason,
            case: `${serverCase} banAdd`,
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
                    { name: `Case`, value: `${serverCase} | Ban`, inline: true},
                    { name: `Reason`, value: `${reason}`, inline: true}
                )
            ]
        })
    }
}