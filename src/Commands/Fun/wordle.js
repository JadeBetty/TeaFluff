const { EmbedBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, InteractionCollector, InteractionType, AutoModerationRuleKeywordPresetType } = require("discord.js")
let { wordleCooldownCache, userCache } = require(`../../utils/Cache`);
const UserModel = require("../../schema/user");
module.exports = {
    name: "wordle",
    description: "Plays wordle in discord!",
    category: 'Fun',
    aliases: ["w"],
    run: async (client, message, args) => {

        let coolDown = wordleCooldownCache.get(message.author.id);
        if (Date.now() - coolDown > 0 && Date.now() - coolDown < 1440 * 60 * 1000) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setDescription(
                            `You can only play wordle once every 24 hour!`,
                        ),


                ],
            });
        }
        wordleCooldownCache.set(message.author.id, Date.now());
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

        let words = ["books", "apple", "color", "ready", "house", "table", "light", "sugar", "goals", "sweat", "water", "drink", "sport", "fluid", "foray", "elite", "plant", "spawn"]
        let solution = words[Math.floor(Math.random() * words.length)];
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
            .setFooter({ text: `You Have 6 Tries To Guess The Word` })
            .setColor("Green")
        let msg = await message.reply({
            embeds: [game],
            components: [row]
        })


        const filter = i => i.customId.slice(0, 5) === solution && i.user.id === message.author.id;

        const collector = message.channel.createMessageComponentCollector({ time: 65000, filter });
        const collector2 = new InteractionCollector(client, {
            channel: message.channel.id,
            interactionType: InteractionType.ModalSubmit,
        })

        collector.on('collect', async i => {
            if (i.user.id !== message.author.id) return i.reply({
                content: 'This is not for you.',
                ephemeral: true
            })

            if (i.customId === solution + id) {
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
                    gamedesc[tries] = `${result} - ${guess}`;
                    await c.update({
                        embeds: [game.setDescription(`You got the correct word! \n \n ${gamedesc.join('\n')}`)]
                    }).catch(err => { })
                    await c.followUp({
                        content: `You got the correct word!`,
                        ephemeral: true
                    }).catch(err => { })
                    collector.stop()
                    collector2.stop()

                    let wordleWins = userCache.get(message.author.id) || {
                        wordleWins: 0,
                        id: message.author.id,
                    }
            
                    wordleWins.wordleWins++;
                    userCache.set(message.author.id, wordleWins);
            
                    await UserModel.updateOne(
                        {
                            id: message.author.id,
                        },
                        { id: message.author.id, wordleWins: wordleWins.wordleWin },
                        { upsert: true },
                    );

                } else {
                    gamedesc[tries] = `${result} - ${guess}`;
                    tries++
                    if (tries === 6) {
                        game = new EmbedBuilder()
                        .setTitle("Wordle")
                        .setDescription(`You used your 6 tries, the correct word is ${solution} \n ${gamedesc.join('\n')}`)
                        .setColor("Green")
                        .setFooter({text: `You used your 6 tries, the correct word is ${solution}`})
                        await c.update({
                            embeds: [game]
                        }).catch(err => { })
                        collector.stop()
                        collector2.stop()
                    }else{
                        await c.update({embeds: [game.setDescription(gamedesc.join('\n'))]}).catch(err => {})
                    }
                }


            }
        });

        collector.on('end', async (i, reason) => {
            collector2.stop()
            if (reason === "time") {
                msg.components[0].components[0].disabled = true
                await msg.edit({
                    content: `Times Up! The correct word is **\`${solution}\`**`,
                    embeds: []
                })
            } else {
                msg.components[0].components[0].disabled = true
                await msg.edit({
                    components: [row],
                })

            }
        });
    }
}