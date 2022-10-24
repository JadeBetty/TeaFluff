//const { author } = require('canvacord');
const { Client, EmbedBuilder, Collection, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, InteractionCollector } = require('discord.js')
const fs = require('fs');
//const { description } = require('./ppsize');
Client.b = new Collection()
Client.c = new Collection()

module.exports = {
  name: 'help',
  description: 'Help Command',
  aliases: ['Help', 'HELP'],
  run: async ( client, message, args ) => {



//console.log(message)



    const C = fs.readdirSync("./Commands").filter(file => file.endsWith(".js"));
    const SC = fs.readdirSync("./slashcommands/stuff").filter(file => file.endsWith(".js"));


    const total = C.length + SC.length;
    const a = [];
    for (let file of C) {
      const commandName = file.split(".")[0];
      const command = require(`../Commands/${commandName}`);
      Client.b.set(commandName, command);
      a.push(commandName)
    }
    const b = []
    a.forEach((file) => {
      b.push(`-**${Client.b.get(file).name}**: ${Client.b.get(file).description}`)
    })

    const c = b.join(`\n`)


    const d = []
    for (let file of SC) {
      const commandName = file.split(".")[0]
      const command = require(`../slashcommands/pign/${commandName}`)
      Client.c.set(commandName, command);
      d.push(commandName)

    }
    const e = []
    d.forEach((file) => {
      e.push(`**${Client.c.get(file).data.name}**: ${Client.c.get(file).data.description}`)
    })

    const f = e.join(`\n`)
    /*
    
            const g = []
    
            b.forEach((file) => {
              g.push(`${Client.b.get(file).category}`)
            })
    /*
            const g = []
            d.forEach((file) => {
               e.push(`**${file}**: ${Client.c.get(file).data.name}`)
             })
    
    
      /*  
            const map = new Map()
            client.commands.forEach((a) => {
               if(map.has(a.category)) map.get(a.category).push(a)
              else map.set(a.category, [a])
            });
    
        */
    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('next')
          .setLabel('🡠')
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId('pages')
          .setLabel('1/2')
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId('ne')
          .setLabel('🡢')
          .setStyle(ButtonStyle.Primary),

      )

    let p1 = new EmbedBuilder()
      .setColor('Blue')
      //  .setTitle(`All Commands : ${total} `)
      .setDescription(` ** Help | ${message.author}** \n All Commands: ${total} \n  Total Commands = ${C.length} \n Total Slash Commands = ${SC.length} \n ${c} \n   `)
    /*
            message.reply({
              embeds: [p1],
              components: [row]
    
            });
            
    */

    const p2 = new EmbedBuilder()
      .setColor("Blue")
      //.setTitle(`Slash Commands : ${SC.length}`)

      .setDescription(`** Slash Commands Help | ${message.author} ** \n Total Slash Commands: ${SC.length} \n ${f}`)

    const msg = await message.reply({
      embeds: [p1],
      components: [row]

    });
    let collector = msg.createMessageComponentCollector({
      componentType: ComponentType.Button

    });
    collector.on("collect", async (c) => {
      //     const value = c.values?.[0]
      if (c.customId === 'next') {
        row.components[0].setDisabled(true)
        row.components[2].setDisabled(false)
        row.components[1].setLabel('1/2')

        c.update({ embeds: [p1], components: [row] });

      }
      if (c.customId === 'ne') {
        row.components[0].setDisabled(false)
        row.components[2].setDisabled(true)
        row.components[1].setLabel('2/2')
        c.update({ embeds: [p2], components: [row] })

      }
      if(c.customId === 'pages')  {
        c.reply({content: 'Why would you click the Pages button? ', ephemeral: true})
      }


    })


  }
}