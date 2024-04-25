const moment = require("moment");
const Discord = require("discord.js");
const config = require("../../config.json");
const GuildSchema = require("../Schema/Guild").GuildData;
const coolDownMap = new Map();
const afkUsers = require("../Commands/General/afk").afk;
const h = ["1137619631985664001"];
module.exports = {
  event: "messageUpdate",
  run: async (oldMessage, message, client) => {
    if (h.includes(message.guild.id)) {
      client.channels.cache
        .get("1079312331298832426")
        .send(
          `old message content: ${oldMessage.content} new message content: ${message.content} by: ${message.author.id} in: ${message.channel.name} guild: ${message.guild.name}`
        );
    }
    if (oldMessage.content === message.content) return;
    if (oldMessage?.author?.bot) return;
    let Guild = await GuildSchema.findOne({ guild: message.guild.id });
    if (!Guild) Guild = await GuildSchema.create({ guild: message.guild.id });
    Guild.save();
    let prefix = Guild.prefix;

    //Information Thing
    if (message.content === "<@1033950258637590619>") {
      message.reply({
        embeds: [
          new Discord.EmbedBuilder()
            .setTitle(`Hello!, I'm ${client.user.username}`)
            .setDescription(
              `Below is how you use a command with my Prefix and Usage!`
            )
            .addFields(
              {
                name: `Prefix:`,
                value: ` \`${prefix}\` | \`/\``,
                inline: true,
              },
              {
                name: `Usage: `,
                value: `\`${prefix}[command] \` | \`/[command]\``,
                inline: true,
              }
            )
            .setColor("#a8f1b0")
            .setFooter({
              text: `Use ${prefix}info || /info for more information!`,
            })
            .setThumbnail(client.user.displayAvatarURL())
            .setAuthor({
              name: client.user.tag,
              iconURL: client.user.displayAvatarURL(),
            }),
        ],
      });
    }
    //Afk Users
    if (afkUsers.has(message.author.id)) {
      let user = afkUsers.get(message.author.id);
      let timeAgo = moment(user.timestamp).fromNow();

      try {
        await message.member.setNickname(user.username);
      } catch {
        afkUsers.delete(message.author.id);
        message.reply({
          embeds: [
            new Discord.EmbedBuilder()
              .setTitle("AFK Removed")
              .setColor("Green")
              .setDescription(
                `Welcome back ${message.member} I have removed your afk!`
              )
              .addFields(
                { name: `You have afked for:`, value: `${timeAgo}` },
                { name: `Your message:`, value: `${user.reason}` }
              ),
          ],
        });
      }
      if (!message.author?.bot) {
        message.mentions.members.forEach((user) => {
          if (afkUsers.has(user.id)) {
            let userA = afkUsers.get(user.id);
            message.reply({
              embeds: [
                new Discord.EmbedBuilder()
                  .setTitle("User Afk")
                  .setColor("Random")
                  .addFields(
                    { name: `User`, value: user.user.tag },
                    { name: `Reason:`, value: userA.reason },
                    { name: `Afked for:`, value: timeAgo }
                  )
                  .setFooter({ text: "User is currently being AFK" })
                  .setTimestamp(),
              ],
            });
          }
        });
      }
    }
    // Command Thing
    if (!message.guild || !message.content.startsWith(prefix)) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const cmd = args.shift().toLowerCase();
    const command =
      client.commands.get(cmd) ||
      client.commands.find((a) => a.aliases && a.aliases.includes(cmd)) ||
      client.devsCommands.get(cmd) ||
      client.devsCommands.find((a) => a.aliases && a.aliases.includes(cmd));
    if (!command) {
      // const tag = await TagSchema.findOne({ name: message.content.slice(prefix.length).split(/ +/)[0] })
      // if (!tag) return;
      // if (!tag.enabled) return message.reply("This tag hasn't been verified by a moderator yet!")
      // if (tag.guild !== message.guild.id) {
      //   return message.reply("This tag is not in this server!")
      // }
      // if (tag && tag.enabled) {
      //   await message.reply({
      //     content: tag.content
      //   });
      // }
      return;
    }

    if (command.cooldown) {
      if (config.devs.includes(message.author.id)) return;
      if (!coolDownMap.has(command.name)) {
        coolDownMap.set(command.name, new Discord.Collection());
      }

      const current_time = Date.now();
      const time_stamps = coolDownMap.get(command.name);
      const cooldown_amount = command.cooldown * 1000;
      if (time_stamps.has(message.author.id)) {
        const expiration_time =
          time_stamps.get(message.author.id) + cooldown_amount;

        if (current_time < expiration_time) {
          const time_left = (expiration_time - current_time) / 1000;

          return message.reply(
            `Please wait ${time_left.toFixed(1)} more seconds before using ${
              command.name
            }`
          );
        }
      }
      time_stamps.set(message.author.id, current_time);
      setTimeout(() => time_stamps.delete(message.author.id), cooldown_amount);
    }

    const { member, guild } = message;

    if (
      command.roles &&
      command.roles.length > 0 &&
      !member.roles.cache.has((r) => command.roles.includes(r.name))
    ) {
      message.reply("You do not have the required roles to use this command!");
    }

    if (
      command.devOnly ||
      (command.devsOnly && !config.devs.includes(member.id))
    ) {
      return;
    }

    if (command.ownerOnly) {
      return message.reply("This command can only be used by the owner!");
    }

    if (command.permissions && command.permissions.length > 0) {
      if (!member.permissions.has(command.permissions))
        return message.reply(
          "You don't have the required permissions to use this command!"
        );
    }

    if (command)
      console.log(
        `Command : ${command.name} Channel : ${message.channel.name} Guild : ${message.guild.name} By: ${message.author.tag}`
      );

    try {
      await command.run(client, message, args).then(async (res) => {
        if (command.deleteTrigger || command.deletetrigger) {
          setTimeout(async () => {
            await message.delete().catch((err) => {
              console.error(err);
            });
          }, 1000);
        }
      });
    } catch (err) {
      console.log(err);
    }
  },
};
