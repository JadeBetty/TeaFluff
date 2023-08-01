const { EmbedBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, InteractionCollector, InteractionType, AutoModerationRuleKeywordPresetType } = require("discord.js")
const UserModel = require("../../Schema/Users");
let activeGames = [];
module.exports = {
    name: "wordle",
    description: "Plays wordle in discord!",
    category: 'Fun',
    deleteTrigger: true,
    activeGames: activeGames,
    aliases: ["w"],
    run: async (client, message, args) => {
        if(activeGames.includes(message.author.id)) {
            return message.channel.send(
                {
                    embeds: [
                        new EmbedBuilder()
                        .setDescription("You can't start another wordle game, please finish the current one.")
                        .setColor("Red")
                        .setTimestamp()
                        .setAuthor({name: message.author.tag, iconURL: message.author.displayAvatarURL()})
                    ]
                }
            ).then(msg => setTimeout(() => msg.delete(), 60000))
        }
        activeGames.push(message.author.id)
        let id = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
            id += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        const gamedesc = [
            `⬛⬛⬛⬛⬛ - Empty`,
            `⬛⬛⬛⬛⬛ - Empty`,
            `⬛⬛⬛⬛⬛ - Empty`,
            `⬛⬛⬛⬛⬛ - Empty`,
            `⬛⬛⬛⬛⬛ - Empty`,
            `⬛⬛⬛⬛⬛ - Empty`
        ]
        let options = {
            yellow: `🟨`,
            grey: `⬜`,
            green: `🟩`,
            black: `⬛`,
        }

        const modal = new ModalBuilder()
            .setCustomId(`wordle${id}`)
            .setTitle('Wordle');

        const word = new TextInputBuilder()
            .setCustomId(`wordleWord${id}`)
            .setLabel("What's your word?")
            .setStyle('Short')
            .setMinLength(5)
            .setMaxLength(5)
            .setRequired(true);
        const firstActionRow = new ActionRowBuilder().addComponents(word);

        modal.addComponents(firstActionRow);
        const fs = require("fs");
        let allWords = fs.readFileSync("./wordleWords.txt", "utf8");
        let words = allWords.split("\r\n")
        const solution = words[Math.floor(Math.random() * words.length)];
        const newString = allWords.replace(solution, "");
        fs.writeFileSync("./wordleWords.txt", newString);
        var tries = 0
        console.log(solution);
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`${solution}${id}`)
                    .setLabel('Guess')
                    .setStyle(ButtonStyle.Primary),
            );
        let game = new EmbedBuilder()
            .setTitle(`Wordle`)
            .setDescription(gamedesc.join('\n'))
            .setFooter({ text: `You have 6 tries to guess the word` })
            .setTimestamp()
            .setColor("#a8f1b0")
            .setAuthor(
                { name: `${message.author.tag}`, iconURL: message.author.displayAvatarURL() }
            )
        let msg = await message.channel.send({
            embeds: [game],
            components: [row]
        })


        const filter = i => i.customId.slice(0, 5) === solution && i.user.id === message.author.id;

        const collector = msg.createMessageComponentCollector({ time: 90000, filter });
        const collector2 = new InteractionCollector(client, {
            channel: message.channel.id,
            interactionType: InteractionType.ModalSubmit,
        })
        collector.on('collect', async i => {
            if (i.user.id !== message.author.id) return i.reply({
                content: 'This is not for you.',
                ephemeral: true
            })

            if (i.customId === `${solution}${id}`) {
                await i.showModal(modal);
            }
        });
        collector2.on("collect", async (c) => {
            if (c.customId === `wordle${id}`) {
                const wordleinput = c.fields.getTextInputValue(`wordleWord${id}`)
                let guess = wordleinput.toLowerCase();

                var result = "";
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

                if (result === "🟩🟩🟩🟩🟩") {
                    var wordleObj = await UserModel.findOne({ id: message.author.id })

                    if (!wordleObj) {

                        wordleObj = await UserModel.create({

                            id: message.author.id,
                        }, {
                            wordleWins: 1
                        });
                        wordleObj.save()
                    } else {
                        await UserModel.findOneAndUpdate({

                            id: message.author.id,
                        }, {
                            $inc: {
                                wordleWins: 1
                            }
                        });
                    }

                    gamedesc[tries] = `${result} - ${guess}`;
                    await c.update({
                        embeds: [
                            game
                                .setDescription(`You guessed the correct word! \n \n ${gamedesc.join('\n')}`)
                                .setFooter({ text: `You guessed the correct word!` })
                        ],
                    }).catch(err => { })

                    activeGames.splice(activeGames.indexOf(message.author.id), 1)
                    collector.stop()
                    collector2.stop()


                } else {
                    gamedesc[tries] = `${result} - ${guess}`;
                    tries++
                    if (tries === 6) {
                        game = new EmbedBuilder()
                            .setTitle("Wordle")
                            .setDescription(`You used your 6 tries, the correct word was **${solution}** \n \n ${gamedesc.join('\n')}`)
                            .setColor("#f09999")
                            .setTimestamp()
                            .setFooter({ text: `You used your 6 tries, the correct word was ${solution}` })
                        await c.update({
                            embeds: [game]
                        }).catch(err => { })
                        collector.stop()
                        collector2.stop()
                    } else {
                        await c.update({
                            embeds: [
                                game
                                    .setDescription(gamedesc.join('\n'))
                                    .setFooter({ text: `You have ${6 - tries} tries to guess the word` })
                            ]
                        }).catch(err => { })
                    }
                }


            }
        });

        collector.on('end', async (i, reason) => {
            collector2.stop()
            if (reason === "time") {
                const newRow = ActionRowBuilder.from(row).setComponents(
                    new ButtonBuilder()
                        .setLabel("Guess")
                        .setDisabled(true)
                        .setStyle(ButtonStyle.Primary)
                        .setCustomId("newButtonWordle")

                )

                await msg.edit({
                    content: `Times Up! The correct word is **\`${solution}\`**`,
                    embeds: [],
                    components: [newRow]
                })
            } else {

                const newRow = ActionRowBuilder.from(row).setComponents(
                    new ButtonBuilder()
                        .setLabel("Guess")
                        .setDisabled(true)
                        .setStyle(ButtonStyle.Primary)
                        .setCustomId("newButtonWordle")

                )
                await msg.edit({
                    components: [newRow]
                })
            }
        });
    }
}