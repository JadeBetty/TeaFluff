require('dotenv').config();

const Discord = require("discord.js");

const client = new Discord.Client({
  intents: ["Guilds", "GuildMessages", "MessageContent", "GuildVoiceStates", "GuildMembers", "DirectMessages", "GuildPresences"],
  partials: [Discord.Partials.Message, Discord.Partials.Channel, Discord.Partials.Reaction],
    
})
const fs = require("fs")

const { prefix, clientId, thankslog } = require("./config.json")
client.commands = new Discord.Collection();
client.events = new Discord.Collection();
client.aliases = new Discord.Collection();
client.slashcommands = new Discord.Collection();    
['Command_handler', 'event_handler', 'slashcommands', 'mongoConnection'].forEach(handler => {
  require(`./functions/${handler}`)(client, Discord)
});
module.exports = client;

console.log(`————————————————— Slash Commands ———————————————————`)

fs.readdirSync(`./slashcommands`).forEach(subfolder => {
  
const slashcommandsFiles = fs.readdirSync(`./slashcommands/${subfolder}`).filter(file => file.endsWith('js'));
  
for (const file of slashcommandsFiles) {
  const slash = require(`./slashcommands/${subfolder}/${file}`)
  console.log(`Slash Commands - ${file} loaded.`)
  client.slashcommands.set(slash.data.name, slash)
}
})

client.config = {
  colors: {
    primary: Discord.resolveColor("#5865F2"), // blurple
    success: Discord.resolveColor("#2ECC71"),// green
    error: Discord.resolveColor('#E74C3C'), // red
    warning: Discord.resolveColor('#E67E22'), // orange
  },
  errEmbed: (message, title, description) => {
    return message.reply({
      embeds: [
        {
          title: title,
          description: description,
          color: client.config.colors.error,
        },
      ],
    });
  },
  handleError: (error, message) => {
    return client.config.errEmbed(
      message,
      'Error!',
      `An error has occured, please try again later.\n\n**Error: **\`\`\`js\n${error}\`\`\``,
    );
  },

}
process.on('unhandledRejection', error => {
	console.error('Unhandled promise rejection:', error);
});

process.on('uncaughtException', (err, origin) => {
  let channel = client.channels.cache.get(thankslog);
  console.log(err, origin);
});


client.login(process.env.token);