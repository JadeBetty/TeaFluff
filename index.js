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

client.login(process.env.token);