require('dotenv').config();

const Discord = require("discord.js");

const client = new Discord.Client({
    intents: ["Guilds", "GuildMessages", "MessageContent"]
})

const { prefix, clientId } = require("./config.json")
client.on("messageCreate", async message => {
    if(message.content === "testig") {
        message.channel.send("works")
    }
})
client.commands = new Discord.Collection();
client.events = new Discord.Collection();
client.aliases = new Discord.Collection();
client.slashcommands = new Discord.Collection();    
['Command_handler', 'event_handler', 'slashcommands'].forEach(handler => {
  require(`./functions/${handler}`)(client, Discord)
});

client.login(process.env.token);