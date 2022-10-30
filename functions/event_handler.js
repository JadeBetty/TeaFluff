module.exports = (client, Discord, interaction, InteractionType) => {
    const fs = require('fs');
    let { prefix } = require("../config.json")
    const snipe = new Discord.Collection();
    // I'm putting the snipe collection here so incase you don't get confused later about snipe, you can remove it if you don't have snipe command.
  
  
    const events = fs.readdirSync("./Events")
    for ( let file of events) {
      const event = require(`../Events/${file}`)
      client.events.set(event.name, event)
    }
    client.events.forEach(event => {
      if (event.ws) {
        client.ws.on(event.name, item => {
          event.run(item, { client, Discord, interaction, InteractionType })
        })
      } else {
        client.on(event.name, (item1, item2) => {
          event.run(item1, { client, Discord, prefix, snipe, interaction, InteractionType  /*you can remove the snipe here if you want, also when you need any more things to export just define the things above and pass them here*/ }, item2)
        })
      }
    });
  }