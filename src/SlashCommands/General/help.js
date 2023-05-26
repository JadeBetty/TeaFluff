const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const GuildSchema = require("../../Schema/Guild").GuildData;
module.exports = {
    category: "General",
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('General Help Command'),
    async run(client, interaction) {
        const Guild = await GuildSchema.findOne({ guild: interaction.guild.id });
        const prefix = Guild.prefix;
        let commands = Array.from(client.slashcommands.values())

        let categories = commands.reduce((acc, command) => {
            if (!acc[command.category]) {
                acc[command.category] = [];
            }
            acc[command.category].push(command);
            return acc;
        }, {});
        //console.log(categories);
        let embed = new EmbedBuilder()
            .setColor("#a8f1b0")
            .setTitle("Select category")
            .setDescription(
                `Global Prefix: \`.\`
                Server Prefix: \`${prefix}\` || \`/\`
                Select a category from the select menu given below to view the commands.`
            )
        const emojies = new Map([
            ["Moderation", "🛠️"],
            ["General", "⚙️"],
            ["Fun", "🎮"],
            ["Prefix Commands", "<:questionmark:1087223045317460049>"],
            ["Bot Development", "<:chatbot:1084457407561871360>"],
        ])
        let cat = Object.keys(categories).map(category => {
            if (!category) category = `Default`;
            return {
                label: category,
                value: 'shelp_' + category,
                emoji: emojies.get(category)
            }
        })
        let menu = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId("shelp_" + interaction.member.id)
                .setPlaceholder(
                    "Nothing selected"
                )
                .setOptions(cat)
        )

        await interaction.reply({
            embeds: [embed],
            components: [menu],
            ephemeral: true
        })
    }
}