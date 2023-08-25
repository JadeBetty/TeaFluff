const { EmbedBuilder } = require("discord.js");
const exec = require("child_process").exec;
module.exports = {
    name: "pull",
    category: "Developers",
    devsOnly: true,
    deleteTrigger: true,
    description: "Pull the lastest github repo.",
    aliases: ["p", "gitpull"],
    disabledChannel: [],
    run: async (client, message, args) => {
        exec("git pull", async (error, stdout, stderr) => {
            if (error) return console.log(error);
            let res = stdout || stderr;
            message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Lastest Git Pull")
                        .setColor("Blue")
                        .setDescription(`\`\`\`js\n${res.slice(0, 2000)}\n\`\`\``)
                        .setTimestamp()
                ]
            })
        })
    },
};