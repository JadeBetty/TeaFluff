module.exports = {
    name: `ready`,
    async run(message, { client, Discord, snipe, prefix }) {
        
        console.log(`Logged in as ${client.user.tag}`)

        
        const activities = [
            { name: `${prefix}help`, type: Discord.ActivityType.Watching }, //[0]
            { name: `Imagine Gaming Play`, type: Discord.ActivityType.Watching}, //[1]
            { name: `Halloween`, type: Discord.ActivityType.Watching }, //[2]
            { name: `your C: Drive`, type: Discord.ActivityType.Watching}, //[3]
          ];
        
          setInterval(() => {
            const status = activities[Math.floor(Math.random() * activities.length)]
            client.user.setActivity(`${status.name}`, { type: status.type }, );
           // client.user.setStatus('invisible');
        
        
          }, 9000)

    }


}
