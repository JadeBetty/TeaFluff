const client = require("..")
const Discord = require("discord.js")
const tags = require("../schema/tag");
const user = require("../schema/user");
const { RulesChannel } = require("../schema/rules");
const {
  tagsCache,
  rulesCache,
  userCache,
  blackListCache,
  cBlackListCache,
} = require("../utils/Cache");
const { BlacklistChannel } = require("../schema/blacklist");
const fs = require("fs");
const path = require("path");
const Blacklist = require("../schema/blacklist");
module.exports = {
    event: `ready`,
    async run() {
      //  console.log(client)
        console.log(`Logged in as ${client.user.tag}`)
        fs.readFile(path.join(__dirname, "../../restart.txt"), (err, data) => {
          if (err) {
            return;
          }
          // If the content of the file is not empty, then...
          if (data) {
            // data is a buffer, so we need to convert it to a string
            const restart = data.toString();
            // Split the content of the file into an array
            const [messageId, channelId, guildId, time] = restart.split(",");
            client.channels.fetch(channelId).then((channel) => {
              channel.messages.fetch(messageId).then((message) => {
                // subtract the time from the current time, time is in milliseconds
                const timeLeft = Date.now() - parseInt(time);
                message.edit({
                  embeds: [
                    new Discord.EmbedBuilder()
                      .setTitle("Started!")
                      .setDescription("The bot has started up!")
                      .setColor("Green")
                      .addFields({name: "Time taken", value: `${timeLeft / 1000}s`}),
                  ],
                });
              });
            });
            // Delete the temporary file
            fs.unlink(path.join(__dirname, "../../restart.txt"), (err) => {
              if (err) {
                return;
              }
            });
          }
        });


        const activities = [
            { name: `Imagine Gaming Play`, type: Discord.ActivityType.Watching}, //[1]
            { name: `Gentlemen, it is no nut November. I have planted several snipers on each of your positions`, type: Discord.ActivityType.Watching }, //[2]
            { name: `your C: Drive`, type: Discord.ActivityType.Watching}, //[3]
            { name: `IGP in a nutshell`, type: Discord.ActivityType.Watching}, //[4]
          ];
        
          setInterval(() => {
            const status = activities[Math.floor(Math.random() * activities.length)]
            client.user.setActivity(`${status.name}`, { type: status.type }, );
           // client.user.setStatus('invisible');
        
        
          }, 10 * 1000)



          Blacklist.find({}, (err, data) => {
            if (err) {
              console.error(err);
            } else {
              /**
               * @param blacklist {Blacklist[]}
               */
              data.forEach((blacklist) => {
                blackListCache.set(blacklist.UserId, true);
              });
            }
          });
          BlacklistChannel.find({}, (err, data) => {
            if (err) {
              console.error(err);
            } else {
              /**
               * @param blacklist {BlacklistChannel[]}
               */
              data.forEach((blacklist) => {
                cBlackListCache.set(blacklist.channelId, true);
              });
            }
          });



          tags.find({}, (err, data) => {
            if (err) {
              console.error(err);
            } else {
              /**
               * @param tag {TagSchema}
               */
              data.forEach((tag) => {
                tagsCache.set(tag.name, tag);
              });
            }
          });
          RulesChannel.find({}, (err, data) => {
            if (err) {
              console.error(err);
            } else {
              /**
               * @param de {RulesChannel[]}
               */
              data.forEach((de) => {
                rulesCache.set(de.guildId, de.rules);
              });
            }
          });
          user.find({}, (err, data) => {
            if (err) {
              console.error(err);
            }
            data.forEach((de) => {
              userCache.set(de.id, de);
            });
          });


        
    }


}
