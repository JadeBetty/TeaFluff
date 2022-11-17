const { EmbedBuilder } = require('discord.js');
const path = require('path');
const exec = require('child_process').exec;
const fs = require('fs');
const { restart } = require('nodemon');

module.exports = {
  name: 'reload',
  category: 'Owner',
  devOnly: true,
  description: 'Reload all the events and commands.',
  aliases: ['reloadall', 'restart'],
  disabledChannel: [],
  run: async (client, message, args) => {
    let msg = await message.channel.send({
      embeds: [
        new EmbedBuilder()
          .setTitle('Restarting...')
          .setDescription('The bot is now restarting.')
          .setColor('Orange'),
      ],
    });
    setTimeout(async () => {
      await msg.edit({
        embeds: [
          new EmbedBuilder()
            .setTitle('Stopped!')
            .setDescription('The bot has finally completed stopped.')
            .setColor('Red')
            .setFooter({
              text: 'The bot shall be back within 10-20 seconds.',
            }),
        ],
      });
      // Create a temporary file called "restart.txt" and write the message id, message channel, guild channel to it
      const file = path.join(__dirname, '../../../restart.txt');
      // id, channel id, guild id and current time must be written to the file
      let data = `${msg.id},${msg.channel.id},${msg.guild.id},${Date.now()}`;
      fs.writeFileSync(file, data);
      console.rs
      exec('rs');
    }, 10000);
  },
}