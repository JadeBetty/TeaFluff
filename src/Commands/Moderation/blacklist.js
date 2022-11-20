const { EmbedBuilder, Embed } = require('discord.js');
const Blacklist = require('../../schema/blacklist.js');
const { blackListCache } = require('../../utils/Cache');
module.exports = {
  name: 'blacklist',
  description: 'Blacklist users from using a command.',
  devOnly: false,
  disabledChannel: [],
  permissions: ['BanMembers'],
  deleetTrigger: true,
  category: 'Moderation',
  run: async (client, message, args) => {


    const query = args[0]?.toLowerCase();
    if (!query)
      return message.channel.send(
        "Please provide a query.\nAdd-> ['add','create'] \nRemove -> ['remove','delete']",
      );
    const userId =
      message.mentions?.members?.first()?.id ||
      message.guild?.members?.cache?.get(args[1])
    if (!userId)
      return message.channel.send('Please provide a valid user to blacklist!');

    if (query === 'add' || query === 'create') {
      Blacklist.findOne({ UserId: userId }, async (error, data) => {
        if (error) return;
        if (data) {
          await message.reply({
            embeds: [
              new EmbedBuilder()
                .setTitle("User is already blacklisted.")
                .setDescription(`<@!${userId}> is already blacklisted form using any commands.`)
                .setColor("Gold")
            ],
          });
        } else {
          await new Blacklist({
            UserId: userId,
          }).save();
          blackListCache.set(userId, true);
          await message.reply('✅ User successfully blacklisted.');
        }
      });
    } else if (query === 'remove' || query === 'delete') {
      Blacklist.findOneAndDelete(
        { UserId: userId },
        (error, data) => {
          if (error) console.log(error);
          if (data) {
            data.delete();
            blackListCache.delete(userId);
            return message.reply('✅ User successfully un-blacklisted.');
          } else {
            return message.reply('❌ User is not blacklisted!!');
          }
        },
      );
    } else {
      return message.reply('Invalid query.');
    }
  },
};