const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");

module.exports = {
    name: `search`,
    description: `Searches for the song you want to play.`,
    aliases: ["s"],
    category: "Music",
    voicechannel: true,
    run: async (client, message, args) => {
        let name = args.join(" ");
        if (!name) return message.reply("Please enter the name of the song you want to search!").then(msg => {
            setTimeout(() => {
              msg.delete()
            }, 5000)
        });
        let res
        try {
            res = await client.player.search(name, {
                member: message.member,
                textChannel: message.channel,
                message
            })
        } catch (e) {
            return message.reply({ content: `No results found with your song name.` }).catch(e => { }).then(msg => {
                setTimeout(() => {
                  msg.delete()
                }, 5000)
            })
        }

        if (!res || !res.length || !res.length > 1) return message.reply({ content: `No search results found!`, ephemeral: true }).catch(e => { }).then(msg => {
            setTimeout(() => {
              msg.delete()
            }, 5000)
        })


        const embed = new EmbedBuilder();
        embed.setColor(`Blurple`);
        embed.setTitle(`Searched Music: ${name}`);

        const maxTracks = res.slice(0, 10);

        let track_button_creator = maxTracks.map((song, index) => {
            return new ButtonBuilder()
                .setLabel(`${index + 1}`)
                .setStyle(ButtonStyle.Secondary)
                .setCustomId(`${index + 1}`)
        })

        let buttons1
        let buttons2
        if (track_button_creator.length > 10) {
            buttons1 = new ActionRowBuilder().addComponents(track_button_creator.slice(0, 5))
            buttons2 = new ActionRowBuilder().addComponents(track_button_creator.slice(5, 10))
        } else {
            if (track_button_creator.length > 5) {
                buttons1 = new ActionRowBuilder().addComponents(track_button_creator.slice(0, 5))
                buttons2 = new ActionRowBuilder().addComponents(track_button_creator.slice(5, Number(track_button_creator.length)))
            } else {
                buttons1 = new ActionRowBuilder().addComponents(track_button_creator)
            }
        }

        let cancel = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel(`Cancel`)
                .setStyle(ButtonStyle.Danger)
                .setCustomId('cancel'))

        embed.setDescription(`${maxTracks.map((song, i) => `**${i + 1}**. [${song.name}](${song.url}) | \`${song.uploader.name}\``).join('\n')}\n\n${"Choose a song from **1** to **{maxTracks.length}** ⬇️".replace("{maxTracks.length}", maxTracks.length)}`);
        embed.setTimestamp();
        embed.setFooter({ text: `Music system created by JadeBetty.` })

        let code
        if (buttons1 && buttons2) {
            code = { embeds: [embed], components: [buttons1, buttons2, cancel] }
        } else {
            code = { embeds: [embed], components: [buttons1, cancel] }
        }
        let m = await message.reply(code).then(async Message => {
            const filter = i => i.user.id === message.author.id
            let collector = await message.channel.createMessageComponentCollector({ filter, time: 6000 })

            collector.on('collect', async (button) => {
                switch (button.customId) {
                    case 'cancel': {
                        embed.setDescription(`Music search cancelled`)
                        await button.update({ embeds: [embed], components: [] }).catch(e => { })
                        return collector.stop();
                    }
                        break;
                    default: {

                        embed.setThumbnail(maxTracks[Number(button.customId) - 1].thumbnail)
                        embed.setDescription(`**${res[Number(button.customId) - 1].name}** added to queue`)
                        await button.update({ embeds: [embed], components: [] }).catch(e => { })
                        try {
                            await client.player.play(message.member.voice.channel, res[Number(button.customId) - 1].url, {
                                member: message.member,
                                textChannel: message.channel,
                                message
                            })
                        } catch (e) {
                            await message.reply({ content: `Server Music List - Time Ended!`, ephemeral: true }).catch(e => { }).then(msg => {
                                setTimeout(() => {
                                  msg.delete()
                                }, 5000)
                            })
                        }
                        return collector.stop();
                    }
                }
            });

            collector.on('end', (msg, reason) => {
                if (reason === 'time') {
                    embed.setDescription(`Song search time expired.`)
                    return Message.edit({ embeds: [embed], components: [] }).catch(e => { }).then(msg => {
                        setTimeout(() => {
                          msg.delete()
                        }, 5000)
                    })
                }
            })

        }).catch(e => { })

    }
}