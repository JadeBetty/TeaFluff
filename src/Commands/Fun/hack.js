//const devs = require("../../config.json");

module.exports = {
    name:  "hack",
    description: "Hack someone on Discord! just 4 fun",
    disabledChannel: ["general"],
    category: "Fun",
    run: async (client, message, args) => {
        const target = 
        message.mentions.members.first() ||
        message.guild.members.cache.get(args[1]);
        if(!target) return message.reply(
            "```diff\n- TypeError: Cannot find a target to hack!```"
        )
        if(target.id === message.author.id) return message.reply("```diff\n- TypeError: Cannot hack yourself.```");
        if(target.id === client.user.id) return message.reply("```diff\n- TypeError: Cannot hack this user!.```");
        if(target.user.bot) return message.reply("```diff\n- TypeError: Cannot hack a bot!.```");
        if(target.id === message.guild.ownerId) return message.reply("```diff\n- TypeError: Cannot hack a the owner!.```")
  //      if (devs.includes(target.id)) return message.reply("```diff\n- TypeError: Cannot hack the developers!.```")
        let username = target.user.tag;
        const text = [
            `\`\`\`diff\n+ Hacking ${username}...\n\`\`\``,
            `\`\`\`diff\n+ Getting ${username}'s token...\n\`\`\``,
            `\`\`\`diff\n+ Sending virus to ${username}...\n\`\`\``,
            `\`\`\`diff\n+ Accessing ${username}'s IP Address...\n\`\`\``,
          ];
          const process1 = [
            `\`\`\`diff\n- [#_________] 14% complete\n\`\`\``,
            `\`\`\`diff\n- [##________] 26% complete\n\`\`\``,
            `\`\`\`diff\n- [###_______] 32% complete\n\`\`\``,
          ];
          const process2 = [
            `\`\`\`diff\n- [####______] 41% complete\n\`\`\``,
            `\`\`\`diff\n- [#####_____] 53% complete\n\`\`\``,
            `\`\`\`diff\n- [######____] 67% complete\n\`\`\``,
          ];
          const process3 = [
            `\`\`\`diff\n- [#######___] 72% complete\n\`\`\``,
            `\`\`\`diff\n- [########__] 84% complete\n\`\`\``,
            `\`\`\`diff\n- [#########_] 93% complete\n\`\`\``,
          ];
          const processEnd = `\`\`\`diff\n- [##########] 100% complete\n\`\`\``;
          const endText = `\`\`\`diff\n+ Process exited [exit code 0]\n\`\`\``;
          const result = `\`\`\`diff\n+ ${username} has been hacked successfully!\n\`\`\``;
      
          function getRandom(i) {
            Math.floor(Math.random() * i.length);
          }
      
          const randomText = Math.floor(Math.random() * text.length);
          const randomProcess1 = Math.floor(Math.random() * process1.length);
          const randomProcess2 = Math.floor(Math.random() * process2.length);
          const randomProcess3 = Math.floor(Math.random() * process3.length);
      
          const msg = await message.reply(text[randomText]);
          await setTimeout(() => {
            msg.edit(process1[randomProcess1]);
          }, 1500);
          await setTimeout(() => {
            msg.edit(process2[randomProcess2]);
          }, 2500);
          await setTimeout(() => {
            msg.edit(process3[randomProcess3]);
          }, 3500);
          await setTimeout(() => {
            msg.edit(processEnd);
          }, 4500);
          await setTimeout(() => {
            msg.edit(endText);
          }, 5500);
          await setTimeout(() => {
            msg.edit(result);
          }, 6000);
          await setTimeout(() => {
            msg.delete()
          }, 10000)
    }
}