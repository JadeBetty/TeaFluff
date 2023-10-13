const Discord = require("discord.js");
const fs = require("fs");
const path = require("path");
const config = require("../../config.json");
const { logger } = require("console-wizard")
module.exports = {
    event: "ready",
    async run(client) {
        logger.info(`Logged in as ${client.user.tag}`)
        fs.readFile(path.join(__dirname, "../../restart.txt"), (err, data) => {
            if (err) {
                return;
            }
            if (data) {
                const restart = data.toString();
                const [messageId, time, userid] = restart.split(",");
                const user = client.users.cache.get(userid);
                const timeLeft = Date.now() - parseInt(time);
                user.send({
                    embeds: [
                        new Discord.EmbedBuilder()
                            .setTitle("Started!")
                            .setDescription("The bot has started up!")
                            .setColor("#a8f1b0")
                            .addFields({ name: "Time taken", value: `${timeLeft/1000}s` }),
                    ],
                });

                fs.unlink(path.join(__dirname, "../../restart.txt"), (err) => {
                    if (err) {
                        return;
                    }
                });
            }
        })

        client.commands.set("Slash Commands", ({ category: "Slash Commands" }));
        client.slashcommands.set("Prefix Commands", ({ category: "Prefix Commands" }));

        if(config.maintainence) {
            client.user.setPresence({
                activities: [{
                    name: "An error has occured",
                    type: Discord.ActivityType.Custom
                }],
                status: "idle"
            });
        } else {
            const ServerCount = client.guilds.cache.size > 1000 ? (client.guilds.cache.size / 1000).toFixed(1) : client.guilds.cache.size;
            client.user.setActivity(`Currently in ${ServerCount} servers | /help`, { type: Discord.ActivityType.Custom })
        }
    }
}