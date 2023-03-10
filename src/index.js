require("dotenv").config();

const Discord = require("discord.js");
const client = new Discord.Client({
    intents: ["Guilds", "GuildMessages", "MessageContent", "GuildVoiceStates", "GuildMembers", "GuildPresences", "DirectMessages"],
    partials: [Discord.Partials.Message, Discord.Partials.Channel, Discord.Partials.Reaction],
});

const fs = require("fs");
const { DisTube } = require("distube");
const { SpotifyPlugin } = require("@distube/spotify");
const { SoundCloudPlugin } = require("@distube/soundcloud");
client.commands = new Discord.Collection();
client.events = new Discord.Collection();
client.aliases = new Discord.Collection();
client.slashcommands = new Discord.Collection();
client.devsCommands = new Discord.Collection();
["Commands", "Events", "SlashCommands", "MongoConnection"].forEach(handler => {
    require(`./Handlers/${handler}`)(client, Discord);
})
module.exports = client;

console.log(`————————————————— Slash Commands ———————————————————`)

fs.readdirSync(`./src/SlashCommands`).forEach(subfolder => {

    const slashcommandsFiles = fs.readdirSync(`./src/SlashCommands/${subfolder}`).filter(file => file.endsWith('js'));

    for (const file of slashcommandsFiles) {
        const slash = require(`./SlashCommands/${subfolder}/${file}`)
        console.log(`Slash Commands - ${file} loaded.`)
        client.slashcommands.set(slash.data.name, slash)
    }
})

const distube = new DisTube(client, {
    leaveOnStop: false,
    leaveOnFinish: true,
    emitNewSongOnly: true,
    emitAddSongWhenCreatingQueue: false,
    emitAddListWhenCreatingQueue: false,
    plugins: [
        new SpotifyPlugin({
            emitEventsAfterFetching: true,
        }),
        new SoundCloudPlugin()
    ],
});
client.player = distube;

const errorChannel = new Discord.WebhookClient({url: process.env.errorLogWebhook})
client.errorLogger = errorChannel;
client.login(process.env.token);

process.on('unhandledRejection', async (reason, p) => {
    errorChannel.send({
        embeds: [
            new Discord.EmbedBuilder()
            .setTitle("New unhandledRejection encounted")
            .setDescription(`\`\`\`${reason.stack}\`\`\``)
            .setColor("#f09999")
        ]
    })
});
process.on('uncaughtException', (reason, origin) => {
    
    errorChannel.send({
        embeds: [
            new Discord.EmbedBuilder()
            .setTitle("New uncaughtExpection encounted")
            .setDescription(`\`\`\`${reason.stack}\`\`\``)
            .setColor("#f09999")
        ]
    })
});
process.on('uncaughtExceptionMonitor', (reason, origin) => {
    errorChannel.send({
        embeds: [
            new Discord.EmbedBuilder()
            .setTitle("New uncaughtExceptionMonitor encounted")
            .setDescription(`\`\`\`${reason.stack}\`\`\``)
            .setColor("#f09999")
        ]
    })
})
distube.on('error', (channel, reason) => {
    errorChannel.send({
        embeds: [
            new Discord.EmbedBuilder()
            .setTitle("New error encounted")
            .setDescription(`\`\`\`${reason.stack}\`\`\``)
            .setColor("#f09999")
        ]
    })
})
distube.on("finish", queue => queue.textChannel.send("Queue ended, leaving voice channel...").then(msg => {
    setTimeout(() => {
        msg.delete()
    }, 5000)
}));

