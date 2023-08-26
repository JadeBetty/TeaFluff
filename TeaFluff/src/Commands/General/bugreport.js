const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js");
const GuildSchema = require("../../Schema/Guild").GuildData;
const config = require("../../../config.json");
module.exports = {
    name: "report",
    description: "Report command for sending bugs to the developers.",
    category: "Bot Development",
    deleteTrigger: true,
    aliases: ["bg", "bugs-report", "bugsreport", "bugreport"],
    run: async (client, message, args) => {
        const guild = await GuildSchema.findOne({ guild: message.guild.id });
        const reason = args.join(" ");
        if (!reason) return message.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Invalid Usage!")
                    .setDescription(`Usage: ${guild.prefix}bug-report <bug>`)
                    .setColor("#f09999")
            ]
        })
        const bugChannel = client.channels.cache.get(config.bugChannel);
        if (!bugChannel) return;
        const theButtons = new ActionRowBuilder()
            .addComponents(
            new ButtonBuilder()
                .setLabel("Accept")
                .setCustomId("a-bugreport")
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setLabel("Deny")
                .setCustomId("d-bugreport")
                .setStyle(ButtonStyle.Danger)
            )
        
        bugChannel.send({
            embeds: [
                new EmbedBuilder()
                    .setTitle("New bug reported")
                    .setColor("#f09999")
                    .addFields(
                        { name: `Bug`, value: reason },
                        { name: `By`, value: `<@!${message.author.id}>`},
                        { name: `Guild`, value: message.guild.name },
                        { name: `At`, value: `<t:${Math.floor(new Date() / 1000)}:F>` },
                        { name: `Status`, value: `Not fixed` }
                    )
            ],
            components: [theButtons]
        })
        message.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Bug report submitted")
                    .setDescription("Your bug report has been submitted! Please wait for our developer to check it out!")
                    .setColor("#a8f1b0")
            ]
        })
    }
}