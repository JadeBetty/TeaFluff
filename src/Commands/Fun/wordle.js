const { EmbedBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, InteractionCollector, InteractionType } = require("discord.js")
module.exports = {
    name: "wordle",
    description: "Plays wordle in discord!",
    category: 'Fun',
    aliases: ["w"],
    run: async (client, message, args) => {
        let errEmbed = new EmbedBuilder()
            .setColor("#6F8FAF")
        const gamedesc = [
            `⬛⬛⬛⬛⬛ - Empty`,
            `⬛⬛⬛⬛⬛ - Empty`,
            `⬛⬛⬛⬛⬛ - Empty`,
            `⬛⬛⬛⬛⬛ - Empty`,
            `⬛⬛⬛⬛⬛ - Empty`,
            `⬛⬛⬛⬛⬛ - Empty`
        ]

        const modal = new ModalBuilder()
            .setCustomId('wordle')
            .setTitle('Wordle');

        const word = new TextInputBuilder()
            .setCustomId('wordleWord')
            .setLabel("What's your word?")
            .setStyle('Short')
            .setMinLength(5)
            .setMaxLength(5)
            .setRequired(true);
        const firstActionRow = new ActionRowBuilder().addComponents(word);

        modal.addComponents(firstActionRow);

        let words = ["books", "apple", "color", "ready", "house", "table", "light", "sugar", "goals", "sweat", "water", "drink", "sport", "fluid", "foray", "elite", "plant", "spawn"]
        let solution = words[Math.floor(Math.random() * words.length)];
        console.log(solution);
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`${solution}0`)
                    .setLabel('Guess')
                    .setStyle(ButtonStyle.Primary),
            );
        let game = new EmbedBuilder()
            .setTitle(`Wordle`)
            .setDescription(gamedesc.join('\n'))
            .setFooter({ text: `You Have 6 Tries To Guess The Word` })
            .setColor("Green")
      let msg = await message.reply({
            embeds: [game],
            components: [row]
        })
        const filter = i => i.customId.slice(0, 5) === solution && i.user.id === message.author.id;
        const collector = message.channel.createMessageComponentCollector({ time: 65000, filter });
        collector.on('collect', async i => {
            if (i.user.id !== message.author.id) return i.reply({ content: 'This is not for you.', ephemeral: true })
            if (i.customId.slice(0, 5) === solution) {
                await i.showModal(modal);
            }
        });
        collector.on('end', async (i, reason) => {
            if (reason === "time") {
                if(msg === `Times Up! The Correct Word Was table`)
                await msg.edit({ content: `Times Up! The Correct Word Was **\`${solution}\`**`, components: [], embeds: [] })
            }
        });
    }
}