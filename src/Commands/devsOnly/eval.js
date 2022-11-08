const { EmbedBuilder } = require("@discordjs/builders");
const Discord = require("discord.js");
const { devs} = require("../../../config.json")
module.exports = {
    name: "eval",
    category: "Owner",
    devOnly: true,
    descrition: "Evaulate a JavaScript code.",
    run: async (client, message, args) => {
        const noOwnerEmbed = new Discord.EmbedBuilder()
        .setDescription("Only developers of this cheeka can use this command!")
        .setColor("DarkOrage")
        if(!devs.includes(message.author.id)) return message.channel.send({embeds: [noOwnerEmbed]});
        const clean = async text => {
            if (typeof text === 'string')
              return (
                text
                  // .replace(/`/g, "`" + String.fromCharCode(8203))
                  .replace(/@/g, '@' + String.fromCharCode(8203))
                  .replace(/token/g, '[Something Important]')
              );
            else return text;
          };
          let code = args.join(' ');
          if (!code) {
            return message.channel.send('You forgot your code, dummy');
          }
          // The code might begin in code blocks that is ``` and there might be a extra "js" annotation saying it's a javascript code.
          // Create a regex to replace the ``` if the code starts and ends with it along with the js if it is available at the starting after codeblock
          code = code.replace(/```js/g, '');
          code = code.replace(/```/g, '');
          code = code.replace(/token/g, '[Something Important]');
          try {
            let evalCode = code.includes(`await`)
              ? `;(async () => { ${code} })()`
              : code;
      
            let evaled = await clean(eval(evalCode));
            if (typeof evaled !== 'string') evaled = require('util').inspect(evaled);
      
            let output;
            if (evaled !== undefined) {
              output = `\`\`\`js\n` + evaled + `\n\`\`\``;
            } else {
              output = `\`\`\`fix\nNo Output To Show.\n\`\`\``;
            }
            output = output.length > 1024 ? '```fix\nLarge Output\n```' : output;
            // So, we'll have to filter the output of client.token variable in the output, search for it, and replace it with [Something important]
            output = output.replace(
              new RegExp(client.token, 'g'),
              '[Something Important]',
            );
            const embed = new Discord.EmbedBuilder()
              .setAuthor({name: 'Eval', iconURL: message.author.avatarURL()})
              .addFields(
                {name: "Input", value:`\`\`\`js\n${code}\n\`\`\``},
                {name: `Output`, value: output}
                )
              .setColor('#00ffee')
              .setTimestamp();
            message.channel.send({embeds: [embed]});
          } catch (err) {
            const errorEmb = new Discord.EmbedBuilder()
              .setAuthor({name: 'Eval', iconURL: message.author.avatarURL()})
              .setColor(`#ff0000`)
              .addFields(
                {name: "Input", value: `\`\`\`js\n${code}\n\`\`\``},
                {name: "Error", value: `\`\`\`js\n${err}\n\`\`\``}
              )

            message.channel.send({embeds: [errorEmb]});
          }
    }
}