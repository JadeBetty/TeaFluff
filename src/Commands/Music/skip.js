module.exports = {
    name: `skip`,
    description: "Skips the current song.",
    voicechannel: true,
    category: "Music",
    run: async (client, message, args) => {
        let queue = client.player.getQueue(message.guild.id);
        if (!queue) return message.channel.send("No song is currently playing.");

        let number = args.join(" ");
        if (number) {
            if (!queue.songs.length > number) return message.reply("The number you have entered is higher then the songs in the queue!");
            if (isNaN(number)) return message.reply("Please write a valid number.")
            if (1 > number) return message.reply("Please write a valid number.")
            try {
                let old = queue.songs[0];
                await client.player.jump(message, number).then(song => {
                    return message.reply({ content: `**${old.name}**, Skipped song` }).catch(e => { })
                })
            } catch (e) {
                return message.reply({ content: "Queue is empty", ephemeral: true }).catch(e => { })
            }
        } else {
            try {
                let old = queue.songs[0]
                let success = await queue.skip();
                await message.channel.send({ content: success ? `**${old.name}**, Skipped song.` : `Something went wrong.`})
            } catch (err) {
                console.log(err)
                message.channel.send({content: `Queue is empty.`})
            }
        }
    }
}