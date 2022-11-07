let { afkUsers, tagsCache } = require("../utils/Cache")
const moment = require("moment")
const Discord = require("discord.js")
const { prefix, devs } = require("../config.json")
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
        if (message.content.includes(text)) {
            message.channel.send("How dare you consider Imagine is not cool?! You gotta get banned <:JimDullerDinglson:974359587136344064>.")
        } 
        if (message.content === "<@1033950258637590619>") {
            message.reply({
                embeds: [
                    new Discord.EmbedBuilder()
                    .setTitle(`Hello!, I'm ${client.user.username}`)
                    .setDescription(`Below is how you use a command with my Prefix and Usage!`)
                    .addFields(
                        {name: `Prefix:`, value: ` \`-\` || \`.\``, inline: true},
                        {name: `Usage: `, value: `\`-[command] \` || \`.[command]\``, inline: true}
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


        let rPrefix = prefix.reduce((acc, cur) => {
            if (message.content.startsWith(cur)) acc.push(cur);
            return acc;
          }, [])[0];
          if(
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
                  await message.delete().catch((err) => {console.error(err)});
                }
              });
            } catch (err) {
              console.log(err);
            }



   
    
          

        }
      
    }