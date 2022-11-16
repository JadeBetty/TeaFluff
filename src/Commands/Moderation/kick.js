const { EmbedBuilder } = require("discord.js")
module.exports = {
  name: "kick",
  description: "Kick a user",
  permissions: ["KickMembers"],
  aliases: ["k"],
  category: "Moderation",
  deleteTrigger: true,
  run: async (client, message, args) => {
    try {
      let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
      if (!member) return message.reply('You need to mention someone to kick!');
      let reason = "No reason provided."
      if (args[1]) {
        reason = args[1].join(" ");
      }
      // if (!reason) return message.reply('No reason was given');
      await member.send({
        embeds: [
          new EmbedBuilder()
            .setDescription(
              `You were kicked out of ${message.guild.name} for **${reason}**`
            )
            .setColor("Red")
        ]
      })
      await member.kick();
      await message.reply(`${member.user.tag} was kicked!`);
    } catch (e) {
      console.log(e)
    }
  }
}