require("dotenv").config();

const Discord = require("discord.js");
const client = require("../src/imports/client");

const fs = require("fs");
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

console.log(`————————————————— Slash Commands ———————————————————`)

fs.readdirSync(`./src/SlashCommands`).forEach(subfolder => {

    const slashcommandsFiles = fs.readdirSync(`./src/SlashCommands/${subfolder}`).filter(file => file.endsWith('js'));

    for (const file of slashcommandsFiles) {
        const slash = require(`./SlashCommands/${subfolder}/${file}`)
        console.log(`Slash Commands - ${file} loaded.`)
        client.slashcommands.set(slash.data.name, slash)
    }
})


const errorChannel = new Discord.WebhookClient({ url: process.env.errorLogWebhook })
client.errorLogger = errorChannel;
client.login(process.env.token);

process.on('unhandledRejection', async (reason, p) => {
    console.log(reason)
    return errorChannel.send({
        embeds: [
            new Discord.EmbedBuilder()
                .setTitle("New unhandledRejection encounted")
                .setDescription(`\`\`\`${reason.stack}\`\`\``)
                .setFooter({ text: `TeaFluff` })
                .setColor("#f09999")
        ]
    })
});
process.on('uncaughtException', (reason, origin) => {
    console.log(reason)
    return errorChannel.send({
        embeds: [
            new Discord.EmbedBuilder()
                .setTitle("New uncaughtExpection encounted")
                .setDescription(`\`\`\`${reason.stack}\`\`\``)
                .setFooter({ text: `TeaFluff` })
                .setColor("#f09999")
        ]
    })
});
process.on('uncaughtExceptionMonitor', (reason, origin) => {
    console.log(reason)
    return errorChannel.send({
        embeds: [
            new Discord.EmbedBuilder()
                .setTitle("New uncaughtExceptionMonitor encounted")
                .setDescription(`\`\`\`${reason.stack}\`\`\``)
                .setFooter({ text: `TeaFluff` })
                .setColor("#f09999")
        ]
    })
})

process.on("exit", () => {
    client.user.setActivity("Bot crashed, Please report this to the devs.", {type: Discord.ActivityType.Custom})
})

module.exports = client;