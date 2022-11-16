const { EmbedBuilder } = require("discord.js");
const humanize = import("pretty-ms");
/*const ms = s => {
    const units = [
        { name: 'd', amount: 86400000 },
        { name: 'h', amount: 3600000 },
        { name: 'm', amount: 60000 },
        { name: 's', amount: 1000 },
    ]
    let total = 0;
    for (const unit of units) {
        const regex = new RegExp(`(\\d+)${unit.name}`);
        const match = s.match(regex);
        if (match) {
            total += parseInt(match[1]) * unit.amount;
        }
    }
    console.log("what")
    return total;
}
*/
const { BansModel } = require('../../schema/bans');
module.exports = {
  name: 'ban',
  description: 'Bans a member',
  permissions: ['BanMembers'],
  aliases: ['b'],
  category: 'Moderation',
  deleteTrigger: true,
  disabledChannel: [],
  run: async (client, message, args) => {
    console.log("it runs bruh")
    // Get the first mention from the message
    const member = message.mentions.members.first();
    if (!member) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription(
              `You need to mention a user to ban!`
            )
        ]
      })
    }
    args.shift()
    let duration = null;
    let reason = "No reason provided."
    if (args.length > 0) {
      if (ms(args[0]) > 1) {
        duration = ms(args[0])
        args.shift();
      }
      if (args.length > 0) {
        reason = args.join(" ");
      }
    }
    if (!member.bannable) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription(
              `I can't ban this person, Please move me into a higher role!`
            )
        ]
      })
    }
    if (
      message.member.roles.highest.comparePositionTo(member.roles.highest) < 1
    ) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor('Red')
            .setDescription(
              `You can't ban this member because you don't have the permissions to do so!`,
            ),
        ],
      });
    }

    const embed = new EmbedBuilder()
      .setColor("Red")
      .setDescription(
        `${member.user.tag} have been banned from **${message.guild.name}**`
      )
      .addFields(
        { name: `Reason`, value: reason },
        { nmae: `Moderator`, value: message.author.tag },
        { name: `Duration`, value: duration ? humanize(duration) : 'Permanent' }
      )
      .setAuthor({
        name: message.guild.name,
        iconURL: message.guild.iconURL(),
      })
      .setTimestamp();
    await member
      .send({
        embeds: [embed],
      })
      .catch(() => { });

    // Now, ban the mentioned member permanently
    await member.ban({
      reason: reason,
    });
    await message.reply({
      embeds: [embed],
    });
    BansModel.create({
      id: member.id,
      unbanOn: duration ? duration + Date.now() : null,
      reason: reason,
      moderator: message.author.id,
      active: true,
      guild: message.guild.id,
    });
  }
}