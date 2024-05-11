
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: `loop`,
    description: `Loops the song currently playing.`,
    aliases: ["l", "repeat"],
    category: "Music",
    voicechannel: true,
    run: async (client, message, args) => {
        const queue = client.player.getQueue(message.guild.id);
        if (!queue || !queue.playing) return message.reply({ content: `No music is currently playing.` }).catch(e => { })

        let button = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel(`Queue`)
                .setStyle(ButtonStyle.Secondary)
                .setCustomId("queue"),
            new ButtonBuilder()
                .setLabel(`Now playing music`)
                .setStyle(ButtonStyle.Secondary)
                .setCustomId("nowplaying"),
            new ButtonBuilder()
                .setLabel(`Close loop`)
                .setStyle(ButtonStyle.Danger)
                .setCustomId("close")
        )

        const embed = new EmbedBuilder()
            .setColor("Blurple")
            .setTitle(`Loop system`)
            .setDescription(`> **How about making a choice?**
            > **Queue:** Loops the queue.
            > **Now Playing Music:** Loops the current song.
            > **Close Loop:** Closes the loop.`)
            .setTimestamp()
            .setAuthor({ name: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL()}` })
            .setFooter({ text: `Requested by ${message.author.tag}` })
        message.reply({ embeds: [embed], components: [button], fetchReply: true }).then(async Message => {
            const filter = i => i.user.id === message.author.id
            let col = await message.channel.createMessageComponentCollector({ filter, time: 120000 });
            col.on('collect', async (button) => {
                if (button.user.id !== message.author.id) return
                const queue1 = client.player.getQueue(message.guild.id);
                if (!queue1 || !queue1.playing) {
                    await message.edit({ content: `No song is currently playing.` }).catch(e => { })
                    await button.deferUpdate().catch(e => { })
                }
                switch (button.customId) {
                    case 'queue':
                        const success = queue.setRepeatMode(2);
                        Message.edit({ content: `Queue repeat mode.` }).catch(e => { })
                        await button.deferUpdate().catch(e => { })
                        break
                    case 'nowplaying':
                        const success2 = queue.setRepeatMode(1);
                        Message.edit({ content: `Now playing current song with repeat mode.` }).catch(e => { })
                        await button.deferUpdate().catch(e => { })
                        break
                    case 'close':
                        if (queue.repeatMode === 0) {
                            await button.deferUpdate().catch(e => { })
                            return Message.edit({ content: `Loop mode is already inactive` }).catch(e => { })
                        }
                        const success4 = queue.setRepeatMode(0);
                        message.edit({ content: `Loop mode **Closed**` }).catch(e => { })
                        await button.deferUpdate().catch(e => { })
                        break
                }
            })
            col.on('end', async (button) => {
                button = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Secondary)
                        .setLabel(`Time is up.`)
                        .setCustomId("timeend")
                        .setDisabled(true))

                const embed = new EmbedBuilder()
                    .setColor("Blurple")
                    .setTitle(`Loop system - Ended.`)
                    .setTimestamp()
                    .setAuthor({ name: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL()}` })

                await Message.edit({ content: "", embeds: [embed], components: [button] }).catch(e => { });
            })
        }).catch(e => { })

    }
}