const {exec} = require('child_process');
const {EmbedBuilder} = require('discord.js');
const { thankslogs, devs } = require("../../../config.json")

module.exports = {
  name: 'shell',
  description: 'Execute shell commands from discord.',
  aliases: ['run'],
  disabledChannel: [],
  devOnly: true,
  category: 'Owner',
  run: async (client, message, args) => {
    if (devs.includes(message.author.id)) {
      if (!__dirname.startsWith(`/root/fb/Cheeka/`))
        return message.reply(
          'This command is not executable on the this device!',
        );

      const command = args.join(' ');
      if (!command) return message.reply('Provide the shell command.');
      client.channels.cache.get(thankslogs).send({
        embeds: [
          new EmbedBuilder()
            .setTitle('New Shell!')
            .addField({
              name: 'Executor',
              value: `${message.author.tag} | ${message.author.id} | <@!${message.author.id}>`,
      })
            .addField('Input', `\`\`\`js\n${command}\n\`\`\``),
        ],
      });
      exec(command, async (err, stdout, stderr) => {
        if (err) return console.log(err);
        let res = stdout || stderr;
        message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setTitle('Shell')
              .setColor('Aqua')
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