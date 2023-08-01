const { SlashCommandBuilder, EmbedBuilder} = require('discord.js');
module.exports = {
    category: "General",
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Shows an Avatar of an user')
        .addUserOption(option => option
            .setName("user")
            .setDescription("The user you want to show")),
    async run(client, interaction) {
        const user = interaction.options.getMember("user") || interaction.member;
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor("#a8f1b0")
                .setTitle(`${user.user.username}'s Avatar!`)
                .setImage(user.displayAvatarURL({size: 2048}))
                .setFooter({
                    text: `Requested by ${interaction.user.tag}`,
                    iconURL: interaction.user.displayAvatarURL({
                        size: 2048
                    })
                })
            ]
        })
    }
}