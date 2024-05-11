const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");

module.exports = {
    name: `queue`,
    description: `Shows the playlist of the queue.`,
    aliases: ["q"],
    category: "Music",
    voicechannel: true,
    run: async (client, message, args) => {
        const queue = client.player.getQueue(message.guild.id);
        if (!queue || !queue.playing) return message.reply("No music is currently playing.").then(msg => {
            setTimeout(() => {
              msg.delete()
            }, 5000)
        });
        const track = queue.songs[0];
        if (!track) return message.reply({ content: "No music is currently playing." }).catch(e => { }).then(msg => {
            setTimeout(() => {
              msg.delete()
            }, 5000)
        });

        const trackl = []
        queue.songs.map(async (track, i) => {
            trackl.push({
                title: track.name,
                author: track.uploader.name,
                user: track.user,
                url: track.url,
                duration: track.duration
            })
        })

        const backId = "emojiBack"
        const forwardId = "emojiForward"
        const backButton = new ButtonBuilder({
            style: ButtonStyle.Secondary,
            emoji: "⬅️",
            customId: backId
        });

        const deleteButton = new ButtonBuilder({
            style: ButtonStyle.Secondary,
            emoji: "❌",
            customId: "close"
        });

        const forwardButton = new ButtonBuilder({
            style: ButtonStyle.Secondary,
            emoji: "➡️",
            customId: forwardId
        });

        let kaçtane = 8
        let page = 1
        let a = trackl.length / kaçtane

        const generateEmbed = async (start) => {
            let sayı = page === 1 ? 1 : page * kaçtane - kaçtane + 1
            const current = trackl.slice(start, start + kaçtane)
            if (!current || !current?.length > 0) return message.reply({ content: `Queue is empty`, ephemeral: true }).catch(e => { })
            return new EmbedBuilder()
                .setTitle(`Music Server List - ${message.guild.name}`)
                .setThumbnail(message.guild.iconURL({ size: 2048, dynamic: true }))
                .setColor(`Blurple`)
                .setDescription(`Currently playing: \`${queue.songs[0].name}\`
      ${current.map(data =>
                    `\n\`${sayı++}\` | [${data.title}](${data.url}) | **${data.author}** (Requested by <@${data.user.id}>)`
                )}`)
                .setFooter({ text: `Page ${page}/${Math.floor(a + 1)}` })
        }
        const canFitOnOnePage = trackl.length <= kaçtane

        await message.reply({
            embeds: [await generateEmbed(0)],
            components: canFitOnOnePage
                ? []
                : [new ActionRowBuilder({ components: [deleteButton, forwardButton] })],
            fetchReply: true
        }).then(msg => {
            setTimeout(() => {
              msg.delete()
            }, 10000)
        });

        if (canFitOnOnePage === true) return;
        const filter = i => i.user.id === message.user.id
        const collector = message.channel.createMessageComponentCollector({ filter, time: 120000 });


        let currentIndex = 0
        collector.on("collect", async (button) => {
            if (button.customId === "close") {
                collector.stop()
                return button.reply({ content: `The command processor has been cancelled.`, ephemeral: true }).catch(e => { }).then(msg => {
                    setTimeout(() => {
                      msg.delete()
                    }, 10000)
                });
            } else {

                if (button.customId === backId) {
                    page--
                }
                if (button.customId === forwardId) {
                    page++
                }

                button.customId === backId
                    ? (currentIndex -= kaçtane)
                    : (currentIndex += kaçtane)

                await message.reply({
                    embeds: [await generateEmbed(currentIndex)],
                    components: [
                        new ActionRowBuilder({
                            components: [
                                ...(currentIndex ? [backButton] : []),
                                deleteButton,
                                ...(currentIndex + kaçtane < trackl.length ? [forwardButton] : []),
                            ],
                        }),
                    ],
                }).catch(e => { }).then(msg => {
                    setTimeout(() => {
                      msg.delete()
                    }, 10000)
                });
                await button.deferUpdate().catch(e => { }).then(msg => {
                    setTimeout(() => {
                      msg.delete()
                    }, 10000)
                });
            }
        })

        collector.on("end", async (button) => {


            button = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji("⬅️")
                    .setCustomId(backId)
                    .setDisabled(true),
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji("❌")
                    .setCustomId("close")
                    .setDisabled(true),
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji("➡️")
                    .setCustomId(forwardId)
                    .setDisabled(true))

            const embed = new EmbedBuilder()
                .setTitle(`Server Music List - Time Ended!`)
                .setThumbnail(message.guild.iconURL({ size: 2048, dynamic: true }))
                .setColor(`Blurple`)
                .setDescription(`Your time has expired to use this command, you can type \`-queue\` to use the command again.`)
                .setFooter({ text: `Music system created by JadeBetty` })
            return message.reply({ embeds: [embed], components: [button] }).catch(e => { }).then(msg => {
                setTimeout(() => {
                  msg.delete()
                }, 10000)
            });

        })
    }


}