const { exec } = require('child_process');
const { EmbedBuilder } = require('discord.js');

const { devs } = require("../../../config.json")
module.exports = {
  name: 'gitpull',
  description: 'Pull latest code from github.',
  aliases: ['gp'],
  disabledChannel: [],
  category: 'Owner',

  run: async (client, message, args) => {
    if (devs.includes(message.author.id)) {
      const command = 'git pull';
      exec(command, async (err, stdout, stderr) => {
        if (err) return console.log(err);
        let res = stdout || stderr;
        message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setTitle('Git Pull')
              .setColor('#171515')
              .setDescription(`\`\`\`js\n${res.slice(0, 2000)}\n\`\`\``),
          ],
        });
      });
    } else
      return message.reply(
        'Only the developers of cheeku can run this command.',
      );
  },
};