const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    category: "General",
    data: new SlashCommandBuilder()
        .setName('membercount')
        .setDescription('Displays information about the server\'s members'),
    async run(client, interaction) {
        const memberCount = interaction.guild.memberCount
        const humans = (await interaction.guild.members.cache).filter(member => !member.user.bot).size
        const bots = (await interaction.guild.members.cache).filter(member => member.user.bot).size
        interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setTitle(`Member Count For ${interaction.guild.name}`)
                    .setDescription(`**Total Member:** ${memberCount} \n **Total users:** ${humans} \n **Total bots:** ${bots}`)
                    .setTimestamp()
                    .setAuthor({name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL()})
                    .setColor("#a8f1b0")
            ],
        })
    }
}