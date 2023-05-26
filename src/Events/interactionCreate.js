const { EmbedBuilder } = require("discord.js");
const BLGuild = require("../Schema/Blacklist");
const BLUser = require("../Schema/Blacklist").bluser;
const imports = require("../imports/embed");
module.exports = {
    event: "interactionCreate",
    async run(interaction, client) {
        if (interaction.isCommand()) {
            const command = client.slashcommands.get(interaction.commandName);
            if (!command) return;

            const gdata = await BLGuild.find()
            let BlGStatus;
            gdata.forEach((element) => {
                if (element.guildId === interaction.guild.id) {
                    BlGStatus = true;
                }
            })
            const udata = await BLUser.find();
            let BlUStatus;
            udata.forEach((element) => {
                if (element.userId === interaction.user.id) {
                    BlUStatus = true;
                }
            })
            // .some(entry => entry.guildId === message.guild.id);
            if (BlGStatus) {
                if(command.data.name === "help" || command.data.name === "appeal-server") {
                    try {
                       return  await command.run(client, interaction);
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
                } else {
                    console.log("a")
                    return interaction.reply({
                        embeds: [
                            imports.BLG
                        ],
                        ephemeral: true
                    });
                }
            } 
            if (BlUStatus) {
                if(command.data.name === "help" || command.data.name === "appeal-server") {
                    try {
                        return await command.run(client, interaction);
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
                } else {
                    return interaction.reply({
                        embeds: [
                            imports.BLU
                        ],
                        ephemeral: true
                    })
                }
            }
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
        } else if (interaction.isAutocomplete()) {
            const command = client.slashcommands.get(interaction.commandName);
            if (!command) return;
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