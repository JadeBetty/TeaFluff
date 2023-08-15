const {
    EmbedBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder
} = require('discord.js');
const GuildSchema = require('../Schema/Guild').GuildData;
module.exports = {
    event: 'interactionCreate',
    async run(interaction, client) {
        const Guild = await GuildSchema.findOne({ guild: interaction.guild.id });
        const prefix = Guild.prefix;
        if (interaction.isStringSelectMenu()) {
            if (interaction.customId.startsWith("help_")) {
                let owner_id = interaction.customId.split("_")[1];
                if (interaction.member.id !== owner_id)
                    return interaction.reply({
                        content: "You are not the owner of this help menu.",
                        ephemeral: true,
                    });
                let category = interaction.values[0].split("_")[1];
                if (category === "Slash Commands") {
                    // return interaction.reply("No slash commands that are avaliable on this bot!");
                    let commands = Array.from(client.slashcommands.values())

                    let categories = commands.reduce((acc, command) => {
                        if (!acc[command.category]) {
                            acc[command.category] = [];
                        }
                        acc[command.category].push(command);
                        return acc;
                    }, {});
                    //console.log(categories);
                    let embed = new EmbedBuilder()
                        .setColor("#a8f1b0")
                        .setTitle("Select category")
                        .setDescription(
                            `Global Prefix: \`.\`
                            Server Prefix: \`${prefix}\` || \`/\`
                            Select a category from the select menu given below to view the commands.`
                        )
                        const emojies = new Map([
                            ["Moderation", "🛠️"],
                            ["General", "⚙️"],
                            ["Fun", "🎮"],
                            ["Prefix Commands", "<:questionmark:1087223045317460049>"],
                            ["Bot Development", "<:chatbot:1084457407561871360>"],
                        ])
                    let cat = Object.keys(categories).map(category => {
                        if (!category) category = `Default`;
                        return {
                            label: category,
                            value: 'shelp_' + category,
                            emoji: emojies.get(category)
                        }
                    })
                    let menu = new ActionRowBuilder().addComponents(
                        new StringSelectMenuBuilder()
                            .setCustomId("shelp_" + interaction.member.id)
                            .setPlaceholder(
                                "Nothing selected"
                            )
                            .setOptions(cat)
                    )

                    await interaction.reply({
                        embeds: [embed],
                        components: [menu],
                        ephemeral: true
                    })

                } else {
                    // Get all the commands
                    let Ccommands = Array.from(client.commands.values());
                    let commands = Ccommands.filter(command => {
                        return command.category === category;
                    });

                    let embed = new EmbedBuilder()
                        .setColor("#a8f1b0")
                        .setTitle("Help | " + category)

                    let toBuildString = "";
                    for (let i = 0; i < commands.length; i++) {
                        let command = commands[i];
                        //   console.log(commands[i])
                        toBuildString += `**${prefix}${command.name}** - ${command.description} ${command.permissions ? `[${command.permissions.join(", ")}]` : ""
                            } ${command.devOnly || command.devsOnly ? "Developer Only" : ""}\n`;
                    }
                    embed.setDescription(toBuildString)
                    await interaction.update({
                        embeds: [embed],
                    })
                }
            } else if (interaction.customId.startsWith("shelp")) {
                let owner_id = interaction.customId.split("_")[1];
                if (interaction.member.id !== owner_id)
                    return interaction.reply({
                        content: "You are not the owner of this help menu.",
                        ephemeral: true,
                    });

                let category = interaction.values[0].split("_")[1];

                if (category === "Prefix Commands") {
                    let commands = Array.from(client.commands.values())

                    let categories = commands.reduce((acc, command) => {
                        if (!acc[command.category]) {
                            acc[command.category] = [];
                        }
                        acc[command.category].push(command);
                        return acc;
                    }, {});
                    let embed = new EmbedBuilder()
                        .setColor("#a8f1b0")
                        .setTitle("Select category")
                        .setDescription(
                            `Global Prefix: \`.\`
                            Server Prefix: \`${prefix}\` || \`/\`
                            Select a category from the select menu given below to view the commands.`
                        )
                    const emojies = new Map([
                        ["Moderation", "🛠️"],
                        ["General", "⚙️"],
                        ["Fun", "🎮"],
                        ["Slash Commands", "<:slash:1082844035355529286>"],
                        ["Bot Development", "<:chatbot:1084457407561871360>"]
                    ])
                    let cat = Object.keys(categories).map(category => {
                        if (!category) category = `Default`;
                        return {
                            label: category,
                            value: 'help_' + category,
                            emoji: emojies.get(category)
                        }
                    })

                    let menu = new ActionRowBuilder().addComponents(
                        new StringSelectMenuBuilder()
                            .setCustomId("help_" + interaction.member.id)
                            .setPlaceholder(
                                "Nothing selected"
                            )
                            .setOptions(cat)
                    )


                    await interaction.reply({
                        embeds: [embed],
                        components: [menu],
                        ephemeral: true
                    })

                } else {

                    let Ccommands = Array.from(client.slashcommands.values())
                    let commands = Ccommands.filter((command) => {
                        return command.category === category;
                    })
                    let embed = new EmbedBuilder()
                        .setColor("#a8f1b0")
                        .setTitle("Slash command Help | " + category)

                    let toBuildString = "";
                    for (let i = 0; i < commands.length; i++) {
                        let command = commands[i];
                        const theSlashCommandThing = client.slashId.get(command.data.name);
                        console.log(client.slashId)
                        toBuildString += `</${command.data.name}:${theSlashCommandThing}> - ${command.data.description} ${command.devOnly ? "| Developer Only." : ""}\n`;
                    }
                    embed.setDescription(toBuildString)
                    await interaction.update({
                        embeds: [embed],
                    })

                }
            }
        }
    }
}