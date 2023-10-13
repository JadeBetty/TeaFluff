require("dotenv").config();

const Discord = require("discord.js");
const client = require("../src/imports/client");
const fs = require("fs");
const handleError = require("./imports/handleError");
const { logger } = require("console-wizard");

client.commands = new Discord.Collection();
client.events = new Discord.Collection();
client.aliases = new Discord.Collection();
client.slashcommands = new Discord.Collection();
client.devsCommands = new Discord.Collection();
client.slashId = new Discord.Collection();
["Commands", "Events", "SlashCommands", "MongoConnection"].forEach(handler => {
    require(`./Handlers/${handler}`)(client, Discord);
})

// exports.client = client

logger.info("Slashcommands are loading")

fs.readdirSync(`./src/SlashCommands`).forEach(subfolder => {

    const slashcommandsFiles = fs.readdirSync(`./src/SlashCommands/${subfolder}`).filter(file => file.endsWith('js'));

    for (const file of slashcommandsFiles) {
        const slash = require(`./SlashCommands/${subfolder}/${file}`)
        client.slashcommands.set(slash.data.name, slash);
    }
    logger.info(`${client.slashcommands.size} has been loaded`)
})




client.login(process.env.token);

process.on('unhandledRejection', async (error) => {
    handleError(error)
});
process.on('uncaughtException', (error) => {
    handleError(error)
});
process.on('uncaughtExceptionMonitor', (error) => {
    handleError(error)
})