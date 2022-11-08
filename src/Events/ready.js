const client = require("..")
const Discord = require("discord.js")
const tags = require("../schema/tag");
const user = require("../schema/user");
const { RulesChannel } = require("../schema/rules");
const {
  tagsCache,
  rulesCache,
  userCache
} = require("../utils/Cache");
module.exports = {
    event: `ready`,
    async run() {
      //  console.log(client)
        console.log(`Logged in as ${client.user.tag}`)
        
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
