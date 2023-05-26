const Discord = require("discord.js");
const axios = require("axios")
module.exports = {
    name: "ex",
    run: async (client, message, args) => {
        const axios = require('axios');
        message.channel.send(`[a](https://youtube.com)`)
        axios.post('https://wandbox.org/api/compile.json', {
            code: 'console.log("Hello, World!");',
            compiler: 'nodejs-16.14.0',
        })
            .then(res => {
                console.log(res.data.program_output);
            })
            .catch(error => {
                console.error(error);
            });

            axios.get('https://wandbox.org/api/list.json')
            .then(response => {
              // handle the response data here
              const attachment = new Discord.AttachmentBuilder(
                Buffer.from(response.data.map(a => a.name).join("\n"), "utf-8"), {name: "amongus.txt"}
            )
              return message.channel.send({files: [attachment]})
            })
            .catch(error => {
              // handle the error here
              console.log(error);
            });
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
            } else {
                count = 0;
            }
        }

    }
}