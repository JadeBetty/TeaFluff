let {
  afkUsers,
  tagsCache,
  blackListCache,
  cBlackListCache, } = require("./../utils/Cache")
const moment = require("moment")
const Discord = require("discord.js")
const { prefix, devs } = require("./../../config.json")
const cooldowns = new Map();
module.exports = {
  event: `messageCreate`,
  async run(message) {
    //  console.log("it runs bru")
    const client = require('..');
    let text = [
      "imagine is not cool",
      "imagine is un cool",
      "imagine is stupid",
      "imagine isn't cool"
    ]
    //   const prefix = client.prefix;
    //     const cooldown = new Discord.Collection();
    //
    if (message.content.includes(text)) {
      message.channel.send("How dare you consider Imagine is not cool?! You gotta get banned <:JimDullerDinglson:974359587136344064>.")
    }
    if (message.content.toLowerCase().includes(...[`thanks`, `ty`, `thnx`, `thx`, `thankyou`, `thank you`])) {
      message.channel.send(
        `Want to thank the person who helped you? Use \`.thanks @user\` and make their day`
      );
    }
    if (message.content === "<@1033950258637590619>") {
      message.reply({
        embeds: [
          new Discord.EmbedBuilder()
            .setTitle(`Hello!, I'm ${client.user.username}`)
            .setDescription(`Below is how you use a command with my Prefix and Usage!`)
            .addFields(
              { name: `Prefix:`, value: ` \`-\` || \`.\``, inline: true },
              { name: `Usage: `, value: `\`-[command] \` || \`.[command]\``, inline: true }
            )
            .setColor("#f1a8d4")
            .setFooter({
              text: `Use -info for more information!`
            })
            .setThumbnail(client.user.displayAvatarURL())
            .setAuthor({
              name: client.user.tag,
              iconURL: client.user.displayAvatarURL()
            })
        ]
      })
    }

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
              .setTitle("AFK Removed")
              .setColor("Green")
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
                  .setColor("Random")
                  .addFields(
                    { name: `User`, value: user.user.tag },
                    { name: `Reason:`, value: userA.reason },
                    { name: `Afked for:`, value: timeAgo }
                  )
                  .setFooter({ text: "Imagine trolling someone" })
              ]
            })
          }
        })
      }
    }



    let rPrefix = prefix.reduce((acc, cur) => {
      if (message.content.startsWith(cur)) acc.push(cur);
      return acc;
    }, [])[0];
    if (
      message.author?.bot ||
      !message.guild ||
      !message.content.startsWith(rPrefix)
    )
      return;

    const args = message.content.slice(rPrefix.length).trim().split(/ +/);
    const cmd = args.shift().toLowerCase();
    const command =
      client.commands.get(cmd) ||
      client.commands.find((a) => a.aliases && a.aliases.includes(cmd))
    if (!command) {
      // Check if a tag exists for the similar
      let a = tagsCache.get(
        message.content.slice(rPrefix.length).split(/ +/)[0]
      );
      if (a && a.enabled) {
        // Reply witgith the content
        await message.reply({
          content: a.content,
          allowedMentions: { repliedUser: false, everyone: false },
        });
      }
      return;
    }
    if (command) {
      console.log(` ${message.author.tag}  ${message.channel.name} ${message.guild.name}`)
    }

    const data = blackListCache.get(message.author?.id);
    const blacklistedChannel = cBlackListCache.get(message.channel.id);
    if (blacklistedChannel) {
      let a = await message.reply(
        "You are not allowed to use commands in this channel!"
      );
      setTimeout(() => {
        a.delete();
        message.delete().catch(() => { });
      }, 5000);
      return;
    }
    if (!data) {

      if (command.disabledChannel) {
        // Make sure that the command is not disabled in the channel
        if (command.disabledChannel.includes(message.channel.id)) {
          let a = await message.reply(
            "This command is disabled in this channel!"
          );
          setTimeout(() => {
            a.delete();
            message.delete().catch(() => { });
          }, 5000);
          return;
        }
      }
      if (command.cooldown) {
        //If cooldowns map doesn't have a command.name key then create one.
        if (!cooldowns.has(command.name)) {
          cooldowns.set(command.name, new Discord.Collection());
        }

        const current_time = Date.now();
        const time_stamps = cooldowns.get(command.name);
        const cooldown_amount = command.cooldown * 1000;

        //If time_stamps has a key with the author's id then check the expiration time to send a message to a user.
        if (time_stamps.has(message.author.id)) {
          const expiration_time =
            time_stamps.get(message.author.id) + cooldown_amount;

          if (current_time < expiration_time) {
            const time_left = (expiration_time - current_time) / 1000;

            return message.reply(
              `Please wait ${time_left.toFixed(1)} more seconds before using ${command.name
              }`
            );
          }
        }

        //If the author's id is not in time_stamps then add them with the current time.
        time_stamps.set(message.author.id, current_time);
        //Delete the user's id once the cooldown is over.
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
        message.reply("You do not have the required roles to use this command!");
      }

      if (command.devOnly && !devs.includes(member.id)) {
        return message.reply("This command can only be used by developers!");
      }

      if (command.ownerOnly && member.id === guild.ownerId) {
        return message.reply("This command can only be used by the owner!");
      }

      if (command.permissions && command.permissions.length > 0) {
        if (!member.permissions.has(command.permissions))
          if (!devs.includes(member.id))
            return message.reply(
              "You don't have the required permissions to use this command!"
            );
      }
      if (command.guildOnly && !message.guild)
        return message.reply("This command can only be used in a guild!");



      try {
        await command.run(client, message, args).then(async (res) => {
          if (command.deleteTrigger) {
            await message.delete().catch((err) => { console.error(err) });
          }
        });
      } catch (err) {
        console.log(err);
      }







    } else {
      return message.reply(
        "Sorry you are blacklisted from running the commands."
      );
    }

  }

}