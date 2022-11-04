const client = require("..")
const Discord = require("discord.js")
module.exports = {
    event: `ready`,
    async run() {
      //  console.log(client)
        console.log(`Logged in as ${client.user.tag}`)
        
        const activities = [
            { name: `Imagine Gaming Play`, type: Discord.ActivityType.Watching}, //[1]
            { name: `No nut November`, type: Discord.ActivityType.Watching }, //[2]
            { name: `your C: Drive`, type: Discord.ActivityType.Watching}, //[3]
            { name: `IGP in a nutshell`, type: Discord.ActivityType.Watching}, //[4]
          ];
        
          setInterval(() => {
            const status = activities[Math.floor(Math.random() * activities.length)]
            client.user.setActivity(`${status.name}`, { type: status.type }, );
           // client.user.setStatus('invisible');
        
        
          }, 3000)

    }


}
