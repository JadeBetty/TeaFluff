const Discord = require("discord.js");
const client = new Discord.Client({
    intents: ["Guilds", "GuildMessages", "MessageContent", "GuildVoiceStates", "GuildMembers", "GuildPresences", "DirectMessages"],
    partials: [Discord.Partials.Message, Discord.Partials.Channel, Discord.Partials.Reaction],
});

module.exports = client;