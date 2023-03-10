const {
    EmbedBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder,
} = require("discord.js")


module.exports = {
    name: "help",
    description: "Help command",
    aliases: ["help", "Help"],
    category: "General",
    deleteTrigger: true,
    run: async (client, message, args) => {
        let commands = Array.from(client.commands.values())

        let categories = commands.reduce((acc, command) => {
            if (!acc[command.category]) {
                acc[command.category] = [];
            }
            acc[command.category].push(command);
            return acc;
        }, {});
        let embed = new EmbedBuilder()
            .setColor("#a8f1b0")
            .setTitle("Select category")
            .setDescription(
                'Please select a category from the select menu given below to view the commands.'
            )
        const emojies = new Map([
            ["Moderation", "🛠️"],
            ["General", "⚙️"],
            ["Fun", "🎮"],
            ["Slash Commands", "<:slash:1082844035355529286>"]
        ])
        let cat = Object.keys(categories).map(category => {
            if (!category) category = `Default`;
            return {
                label: category,
                value: 'help_' + category,
                emoji: emojies.get(category)
            }
        })

        let menu = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId("help_" + message.member.id)
                .setPlaceholder(
                    "Nothing selected"
                )
                .setOptions(cat)
        )

        await message.channel.send({
            embeds: [embed],
            components: [menu]
        })
    }
}