const client = require("..");
const Discord = require("discord.js");
const user = require("../Schema/Users");
const fs = require("fs");
const path = require("path");
const { GuildData } = require("../Schema/Guild");

module.exports = {
    event: "ready",
    async run() {
        console.log(`Logged in as ${client.user.tag}`)
        fs.readFile(path.join(__dirname, "../../restart.txt"), (err, data) => {
            if (err) {
                return;
            }
            if (data) {
                const restart = data.toString();
                const [messageId, time, userid] = restart.split(",");
                const user = client.users.cache.get(userid);
                console.log(time)
                const timeLeft = Math.floor(Date.now()/1000) - time;
                user.send({
                    embeds: [
                        new Discord.EmbedBuilder()
                            .setTitle("Started!")
                            .setDescription("The bot has started up!")
                            .setColor("#a8f1b0")
                            .addFields({ name: "Time taken", value: `<t:${timeLeft}:R>` }),
                    ],
                });

                fs.unlink(path.join(__dirname, "../../restart.txt"), (err) => {
                    if (err) {
                        return;
                    }
                });
            }
        });
        // Ready Event Part
        const ServerCount = client.guilds.cache.size > 1000 ? (client.guilds.cache.size / 1000).toFixed(1) : client.guilds.cache.size;
        setInterval(() => {
            client.user.setActivity(`in ${ServerCount} servers | /help`, { type: Discord.ActivityType.Playing })
        }, 1000)

        client.commands.set("Slash Commands", ({ category: "Slash Commands" }))
        client.slashcommands.set("Prefix Commands", ({ category: "Prefix Commands" }))
    }
}