const { SlashCommandBuilder, EmbedBuilder, Client } = require('discord.js');
module.exports = {
    category: "Fun",
    data: new SlashCommandBuilder()
        .setName('8ball')
        .setDescription('Ask the bot a yes/no question and it will answer with yes/no!')
        .addStringOption(option => option
            .setName("question")
            .setDescription("The question you wanna ask")
            .setRequired(true)),
    async run(client, interaction) {
        const answers = [
            'yes.',
            'Absolutely',
            'ofc',
            'obviously yes',
            'The following statement is true.',
            'No.',
            'Nope',
            'false statement',
            "I'll consider it a no",
            'Never.',
            'maybe',
            'probably',
            'idk',
        ];
        const question = await interaction.options.getString("question")
        const answer = answers[Math.floor(Math.random() * answers.length)];
        if (!question) return interaction.reply({ content: "You'll have to ask a question first!", ephemeral: true });
        if (question <= 0) return interaction.reply({content: "Is that really a question?", ephemeral: true });
        const ballsEmbed = new EmbedBuilder()
            .setAuthor({
                name: interaction.user.tag,
                iconURL: interaction.user.displayAvatarURL()
            })

            .setTitle("Magic 8ball")
            .setDescription(
                `> Your question: ${question} \n > Magic 8ball said: ${answer}`
            )
            .setColor("#a8f1b0")
            .setTimestamp()
        await interaction.reply({
            embeds: [ballsEmbed]
        })
    }
}