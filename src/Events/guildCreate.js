const { EmbedBuilder } = require("@discordjs/builders");
const client = require("..");
module.exports = {
    event: "guildCreate",
    async run(guild) {
        if(!guild.systemChannel) return;
        guild.systemChannel.send({ embeds: [
            new EmbedBuilder()
            .setTitle("Thank you for inviting!")
            .setColor("#a8f1b0")
            .setDescription(`Thank you for inviting TeaFluff to your server! Please type \`/help\` to see my available commands!`)
            .addFields(
                { name: `What can this bot do?`, value: `TeaFluff is a bot that can do moderation commands and so much more!`},
                { name: `How do I setup the ticket system?`, value: `Currently ticket system is not avaliable yet!`}
            )
            .setTimestamp()
        ]})
    }
}