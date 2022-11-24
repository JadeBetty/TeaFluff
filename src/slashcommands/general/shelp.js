const { SlashCommandBuilder, EmbedBuilder , ActionRowBuilder, SelectMenuBuilder, ComponentType } = require('discord.js');
module.exports = {
  category: "General",
  data: new SlashCommandBuilder()
    .setName('shelp')
    .setDescription('slash command help command'),
  async run(client, interaction) {
    const { default: ms } = await import("pretty-ms")
    let commands = Array.from(client.slashcommands.values())

    let categories = commands.reduce((acc, command) => {
        if (!acc[command.category]) {
            acc[command.category] = [];
        }
        acc[command.category].push(command);
        return acc;
    }, {});
    //console.log(slashCommandscat)
    //let testing = Arr
    //console.log(categories);
    let embed = new EmbedBuilder()
        .setColor("Blurple")
        .setTitle("Select category")
        .setDescription(
            'Please select a category from the select menu given below to view the commands.'
        )
    let cat = Object.keys(categories).map(category => {
        if (!category) category = `Default`;
        return {
            label: category,
            value: 'help_' + category,
        }
    })

    let menu = new ActionRowBuilder().addComponents(
        new SelectMenuBuilder()
            .setCustomId("help_" + interaction.user.id)
            .setPlaceholder(
                "Nothing selected"
            )
            .setOptions(cat)
    )

    try {
        let msg = await interaction.reply({
            embeds: [embed],
            components: [menu]
        })

        let collector = msg.createMessageComponentCollector({
            componentType: ComponentType.SelectMenu
        })
        collector.on('collect', async m => {
            let owner_id = m.customId.split("_")[1];
            if (m.member.id !== owner_id)
                return m.reply({
                    content: "You are not the owner of this help menu.",
                    ephemeral: true,
                })
         //   console.log(client.slashcommands.values())

            let category = m.values[0].split("_")[1];
            let Ccommands = Array.from(client.slashcommands.values())
            let commands = Ccommands.filter((command) => {
                return command.category === category;
            })
            let embed = new EmbedBuilder()
                .setColor("Blurple")
                .setTitle("Help | " + category)

            let toBuildString = "";
            for (let i = 0; i < commands.length; i++) {
                let command = commands[i];
             //   console.log(commands[i])
                toBuildString += `**${command.data.name}** - \`${command.data.description}\` ${command.data.permissions ? `\`[${command.data.permissions.join(", ")}]\`` : ""
                    } ${command.devOnly ? "`[DEV]`" : ""}\n`;
            }
            embed.setDescription(toBuildString)
            await m.deferUpdate()
            await interaction.editReply({
                embeds: [embed],
            })



        });
    } catch (e) {
        return console.log(e);
    } //console.log(message)


  }
}