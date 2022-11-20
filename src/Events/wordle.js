const { EmbedBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, InteractionCollector, InteractionType } = require("discord.js")
module.exports = {
    event: "interactionCreate",
    async run(interaction) {
        if (interaction.isModalSubmit()) {
            if (interaction.customId === 'wordle') {
                const wordleinput = interaction.fields.getTextInputValue('wordleWord')

                let options = {
                    yellow: `🟨`,
                    grey: `⬜`,
                    green: `🟩`,
                    black: `⬛`,
                }

                let guess = wordleinput.toLowerCase();

                var result = "";

                let row = interaction?.message?.components
                let solution = row[0]?.components[0]?.customId?.slice(0, 5)
                var tries = row[0]?.components[0]?.customId?.slice(5, 6)

                for (let i = 0; i < guess.length; i++) {
                    let guessLetter = guess?.charAt(i);
                    let solutionLetter = solution?.charAt(i);
                    if (guessLetter === solutionLetter) {
                        result = result.concat(options.green)
                    } else if (solution?.indexOf(guessLetter) != -1) {
                        result = result.concat(options.yellow)
                    } else {
                        result = result.concat(options.grey)
                    }
                }
                var what = interaction?.message?.embeds[0]
                var game = EmbedBuilder.from(what)

                let embeddesk = interaction?.message?.embeds[0]?.description
                embeddesk = JSON.stringify(embeddesk.split('\n'));
                const gamedesc = JSON.parse(embeddesk)

                if (result === "🟩🟩🟩🟩🟩") {
                    gamedesc[tries] = `${result} - ${guess}`;
                    console.log(gamedesc)
                    await interaction.update({
                        components: [],
                        embeds: [game.setDescription(gamedesc.join('\n'))]
                    }).catch(err => { })
                    await interaction.followUp({
                        content: `You Got The Correct Word!`,
                        ephemeral: true
                    }).catch(err => { })
                } else if (Number(tries) === 6 || Number(tries) + 1 === 7) {
                    await interaction.update({
                        embeds: [game.setFooter({
                            text: `You Used Your 6 Tries The Correct Word Was ${solution}`
                        })]
                    }).catch(err => { })
                } else {
                    gamedesc[tries] = `${result} - ${guess}`;
                    if (!row[0]?.components[0]) return;
                    row[0].components[0].customId = `${solution}${Number(tries) + 1}`
                    console.log(row[0])
                    await interaction.update({
                        components: row,
                        embeds: [game.setDescription(gamedesc.join('\n'))]
                    }).catch(err => { })
                }
            }
        }
    }
}