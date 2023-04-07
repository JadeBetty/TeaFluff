const Discord = require("discord.js");

module.exports = {
    name: "ex",
    run: async (client, message, args) => {
        const promotionsChannels = [
            "936242386319863880",
            "936242343277912074",
            "936242506469871626"
        ]
        if (!promotionsChannels.includes(message.channel.id)) {
            const messages = await message.channel.messages.fetch({ limit: 10 })
            let count = 0;
            messages.forEach(msg => {
                if (msg.author.id !== client.user.id) {
                    count++;
                }
            })
            if (count < 10) {
                message.delete();
                return message.author.send({
                    embeds: [
                        new Discord.EmbedBuilder()
                            .setTitle("your title or you can remove it")
                            .setDescription("aaa")
                            .setColor("White")
                    ]
                })
            }
        }

    }
}