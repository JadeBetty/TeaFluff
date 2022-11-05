const {
    EmbedBuilder,
    ActionRowBuilder,
    SelectMenuBuilder,
    ComponentType,
    InteractionCollector
} = require("discord.js")


module.exports = {
    name: "help",
    description: "Beta testing help command",
    aliases: ["help", "Help"],
    category: "General",
    run: async (client, message, args) => {
        const { default: ms } = await import("pretty-ms")
        let commands = Array.from(client.commands.values())

        let categories = commands.reduce((acc, command) => {
            if(!acc[command.category]) {
                acc[command.category] = [];
            }
            acc[command.category].push(command);
            return acc;
        }, {});
//console.log(categories);
        let embed = new EmbedBuilder()
        .setColor("Blurple")
        .setTitle("Select category")
        .setDescription(
            'Please select a category from the select menu given below to view the commands.'
        )
        let cat = Object.keys(categories).map(category => {
            if(!category) category = `Default`;
            return {
                label: category,
                value: 'help_' + category,
            }
        })

        let menu = new ActionRowBuilder().addComponents(
            new SelectMenuBuilder()
            .setCustomId("help_"+ message.member.id)
            .setPlaceholder(
                "Nothing selected"
            )
            .setOptions(cat)
        )
        
        try {
          let msg =  await message.reply({
                embeds: [embed],
                components: [menu]
            })
            
            let collector = msg.createMessageComponentCollector({
                componentType: ComponentType.SelectMenu
            })
            collector.on('collect', async m => {
               let owner_id = m.customId.split("_")[1];
               if(m.member.id !== owner_id)
               return m.reply({
                content: "You are not the owner of this help menu.",
                ephemeral: true,
               })

               let category = m.values[0].split("_")[1];
               let Ccommands = Array.from(client.commands.values())
               let commands = Ccommands.filter((command) => {
                return command.category ===  category;
               })

               let embed = new EmbedBuilder()
               .setColor("Blurple")
               .setTitle("Help | " + category)

               let toBuildString = "";
               for (let i = 0; i < commands.length; i++) {
                let command = commands[i];
                toBuildString += `**${command.name}** - \`${command.description}\` ${
                    command.permissions ? `\`[${command.permissions.join(", ")}]\`` : ""
                  } ${command.devOnly ? "`[DEV]`" : ""}\n`;
                }
                embed.setDescription(toBuildString)
                await m.deferUpdate()
                await m.message.edit({
                    embeds: [embed],
                })
            });
        } catch (e) {
            return console.log(e);
        } //console.log(message)
        

    }
} 