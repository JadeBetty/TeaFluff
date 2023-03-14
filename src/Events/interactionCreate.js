const client = require("..");
const { EmbedBuilder } = require("discord.js")
module.exports = {
    event: "interactionCreate",
    async run(interaction) {
        if(interaction.isCommand()) {
            const command = client.slashcommands.get(interaction.commandName);
            if(!command) return
            try {
                await command.run(client, interaction);
            } catch (e) {
                client.errorLogger.send({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("New DiscordAPI encounted")
                            .setDescription(`\`\`\`${e.stack}\`\`\``)
                            .setColor("#f09999")
                    ]
                })
            }
        } else if(interaction.isAutocomplete()) {
            const command = client.slashcommands.get(interaction.commandName);
            if(!command) return;
            try {
                await command.autocomplete(interaction, client);
            } catch (e) {
                client.errorLogger.send({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("New DiscordAPI encounted")
                            .setDescription(`\`\`\`${e.stack}\`\`\``)
                            .setColor("#f09999")
                    ]
                })
            }
        }
    }
}