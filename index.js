require('dotenv').config();

const Discord = require("discord.js");

const client = new Discord.Client({
    intents: ["Guilds", "GuildMessages", "MessageContent"],
    
})

const { prefix, clientId } = require("./config.json")
client.commands = new Discord.Collection();
client.events = new Discord.Collection();
client.aliases = new Discord.Collection();
client.slashcommands = new Discord.Collection();    
['Command_handler', 'event_handler', 'slashcommands', 'mongoConnection'].forEach(handler => {
  require(`./functions/${handler}`)(client, Discord)
});

client.config = {
  colors: {
    primary: '#5865F2', // blurple
    success: '#2ECC71', // green
    error: '#E74C3C', // red
    warning: '#E67E22', // orange
  }
}

client.login(process.env.token);