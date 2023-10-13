const moment = require("moment")
const Discord = require("discord.js")
const config = require("./../../config.json")
const GuildSchema = require("../Schema/Guild").GuildData;
const coolDownMap = new Map();
const BLGuild = require("../Schema/Blacklist")
const BLUser = require("../Schema/Blacklist").bluser
// const TagSchema = require("../Schema/Tag")
const afkUsers = require("../Commands/General/afk").afk
const imports = require("../imports/embed");
module.exports = {
  event: "messageCreate",
  run: async (message, client) => {

    if (message.channel.type === Discord.ChannelType.DM) {
      if (message.author.bot) return;
      let messageDMEmbed = new Discord.EmbedBuilder()
        .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
        .setTitle("New message DM")
        .setDescription(message.content + `\n \n By: ${message.author}`)
        .setColor("#f09999")

      if (message.content && message.attachments.size > 0) {
        messageDMEmbed = new Discord.EmbedBuilder()
          .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
          .setTitle("New message DM")
          .setDescription(message.content + `\n \n By: ${message.author}`)
          .setColor("#f09999")
          .setImage(message.attachments.first().url)
      } else if (message.content) {
        messageDMEmbed = new Discord.EmbedBuilder()
          .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
          .setTitle("New message DM")
          .setDescription(message.content + `\n \n By: ${message.author}`)
          .setColor("#f09999")
      } else if (message.attachments.size > 0) {
        messageDMEmbed = new Discord.EmbedBuilder()
          .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
          .setTitle("New message DM")
          .setColor("#f09999")
          .setImage(message.attachments.first().url)
      }
      let channel = client.channels.cache.get("1080108826088448092");
      return channel.send({
        embeds: [
          messageDMEmbed
        ]
      })
    }

    let Guild = await GuildSchema.findOne({ guild: message.guild.id });
    if (!Guild) Guild = await GuildSchema.create({ guild: message.guild.id })
    Guild.save();
    let prefix = Guild.prefix;
    if (message.author.bot) return;
    //Information Thing
    if (message.content === "<@1033950258637590619>") {
      message.reply({
        embeds: [
          new Discord.EmbedBuilder()
            .setTitle(`Hello!, I'm ${client.user.username}`)
            .setDescription(`Below is how you use a command with my Prefix and Usage!`)
            .addFields(
              { name: `Prefix:`, value: ` \`${prefix}\` | \`/\``, inline: true },
              { name: `Usage: `, value: `\`${prefix}[command] \` | \`/[command]\``, inline: true }
            )
            .setColor("#a8f1b0")
            .setFooter({
              text: `Use ${prefix}info || /info for more information!`
            })
            .setThumbnail(client.user.displayAvatarURL())
            .setAuthor({
              name: client.user.tag,
              iconURL: client.user.displayAvatarURL()
            })
        ]
      })
    }
    //Afk Users
    if (afkUsers.has(message.author.id)) {
      let user = afkUsers.get(message.author.id)
      let timeAgo = moment(user.timestamp).fromNow()

      try {
        await message.member.setNickname(user.username);
      } catch {
        afkUsers.delete(message.author.id);
        message.reply({
          embeds: [
            new Discord.EmbedBuilder()
              .setTitle("Afk Status Removed")
              .setColor("#a8f1b0")
              .setDescription(
                `Welcome back ${message.member} I have removed your afk!`
              )
              .addFields(
                { name: `You have afked for:`, value: `${timeAgo}` },
                { name: `Your message:`, value: `${user.reason}` }
              )
          ]
        })
      }
      if (!message.author?.bot) {
        message.mentions.members.forEach((user) => {
          if (afkUsers.has(user.id)) {
            let userA = afkUsers.get(user.id);
            message.reply({
              embeds: [
                new Discord.EmbedBuilder()
                  .setTitle("User Afk")
                  .setColor("#f2d37c")
                  .addFields(
                    { name: `User`, value: user.user.tag },
                    { name: `Reason:`, value: userA.reason },
                    { name: `Afked for:`, value: timeAgo }
                  )
                  .setFooter({ text: "User is currently being AFK" })
                  .setTimestamp()
              ]
            })
          }
        })
      }
    }

    // Command Thing
    if (
      !message.guild ||
      !message.content.startsWith(prefix)
    ) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const cmd = args.shift().toLowerCase();
    const command =
      client.commands.get(cmd) ||
      client.commands.find((a) => a.aliases && a.aliases.includes(cmd)) ||
      client.devsCommands.get(cmd) ||
      client.devsCommands.find(a => a.aliases && a.aliases.includes(cmd));
    if (!command) {
      return;
    }

    // if(config.maintainence && !config.devs.includes(message.author.id)) {
    //   try {
    //     await command.run(client, message, args).then(async (res) => {
    //       if (command.deleteTrigger || command.deletetrigger) {
    //         setTimeout(async () => {
    //           await message.delete().catch((err) => { console.error(err) });
    //         }, 1000)
    //       }
    //     });
    //     return;
    //   } catch (err) {
    //     console.log(err)
    //     // client.errorLogger.send({
    //     //   embeds: [
    //     //     new Discord.EmbedBuilder()
    //     //       .setTitle("New DiscordAPI encounted")
    //     //       .setDescription(`\`\`\`${err.stack}\`\`\``)
    //     //       .setColor("#f09999")
    //     //   ]
    //     // })
    //   }
    // }

    if(config.maintainence && !config.devs.includes(message.author.id)) return;

    const gdata = await BLGuild.find()
    let BlGStatus;
    gdata.forEach((element) => {
      if (element.guildId === message.guild.id) {
        BlGStatus = true;
      }
    })
    const udata = await BLUser.find();
    let BlUStatus;
    udata.forEach((element) => {
      if (element.userId === message.author.id) {
        BlUStatus = true;
      }
    })
    // .some(entry => entry.guildId === message.guild.id);
    if (BlGStatus) {
      if (command.name === "help") {
        try {
          return await command.run(client, message, args).then(async (res) => {
            if (command.deleteTrigger || command.deletetrigger) {
              setTimeout(async () => {
                await message.delete().catch((err) => { console.error(err) });
              }, 1000)
            }
          });
        } catch (err) {
          client.errorLogger.send({
            embeds: [
              new Discord.EmbedBuilder()
                .setTitle("New DiscordAPI encounted")
                .setDescription(`\`\`\`${err.stack}\`\`\``)
                .setColor("#f09999")
            ]
          })
        }
      } else {
        await message.delete().catch(err => {
          client.errorLogger.send({
            embeds: [
              new Discord.EmbedBuilder()
                .setTitle("New DiscordAPI encounted")
                .setDescription(`\`\`\`${err.stack}\`\`\``)
                .setColor("#f09999")
            ]
          })
        })
        return message.channel.send({
          embeds: [
            imports.BLG
          ]
        })
      }
    }
    if (BlUStatus) {
      if (command.name === "help") {
        try {
          return await command.run(client, message, args).then(async (res) => {
            if (command.deleteTrigger || command.deletetrigger) {
              setTimeout(async () => {
                await message.delete().catch((err) => { console.error(err) });
              }, 1000)
            }
          });
        } catch (err) {
          client.errorLogger.send({
            embeds: [
              new Discord.EmbedBuilder()
                .setTitle("New DiscordAPI encounted")
                .setDescription(`\`\`\`${err.stack}\`\`\``)
                .setColor("#f09999")
            ]
          })
        }

      } else {
        await message.delete().catch(err => {
          client.errorLogger.send({
            embeds: [
              new Discord.EmbedBuilder()
                .setTitle("New DiscordAPI encounted")
                .setDescription(`\`\`\`${err.stack}\`\`\``)
                .setColor("#f09999")
            ]
          })
        })
        return message.channel.send({
          embeds: [
            imports.BLU
          ]
        })
      }
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
            `Please wait ${time_left.toFixed(1)} more seconds before using ${command.name}`
          );
        }
      }
      time_stamps.set(message.author.id, current_time);
      setTimeout(
        () => time_stamps.delete(message.author.id),
        cooldown_amount
      );
    }

    const { member, guild } = message;

    if (
      command.roles &&
      command.roles.length > 0 &&
      !member.roles.cache.has((r) => command.roles.includes(r.name))
    ) {
      message.delete();
      return message.channel.send({
        embeds: [
          imports.IPE
        ]
      })
    }

    if (command.devOnly || command.devsOnly && !config.devs.includes(member.id)) {
      return;
    }

    if (command.ownerOnly) {
      message.delete()
      return message.channel.send({
        embeds: [
          imports.IPE
        ]
      })
    }

    if (command.permissions && command.permissions.length > 0) {
      if (!member.permissions.has(command.permissions)) {
        message.delete()
        return message.channel.send({
          embeds: [
            imports.IPE
          ]
        })
      }

    }

    if (command) {
      console.log(`User: ${message.author.username} - ${message.author.id} Guild: ${message.guild.name} - ${message.guild.id} Channel ID and Name ${message.channel.name} - ${message.channel.id}`);
      const channel = client.channels.cache.get(config.msgc);
      channel.send({
        embeds: [
          new Discord.EmbedBuilder()
            .setTitle("Command Used")
            .addFields(
              { name: "Command", value: command.name },
              { name: "Command Context", value: `${message.content}` },
              { name: "User", value: `${message.author.tag} || ${message.author.id}` },
              { name: "Guild", value: `${message.guild.name} || ${message.guild.id}`}
            )
            .setColor("#a8f1b0")
            .setTimestamp()
        ]
      })
    }

    try {
      await command.run(client, message, args).then(async (res) => {
        if (command.deleteTrigger || command.deletetrigger) {
          setTimeout(async () => {
            await message.delete().catch((err) => { console.error(err) });
          }, 1000)
        }
      });
    } catch (err) {
      console.log(err)
      // client.errorLogger.send({
      //   embeds: [
      //     new Discord.EmbedBuilder()
      //       .setTitle("New DiscordAPI encounted")
      //       .setDescription(`\`\`\`${err.stack}\`\`\``)
      //       .setColor("#f09999")
      //   ]
      // })
    }
  }
}
