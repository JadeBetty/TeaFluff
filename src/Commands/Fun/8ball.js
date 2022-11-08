const Discord = require("discord.js");
module.exports = {
    name: "8ball",
    description: "ask a question, the bot will reply to it",
    category: "Fun",
    run: async (client, message, args) => {
        const answers = [
            'yes.',
            'Absolutely',
            'ofc',
            'obviously yes',
            'The following statement is true.',
            'No.',
            'Nope',
            'false statement',
            "I'll consider it a no",
            'Never.',
            'maybe',
            'probably',
            'idk',
          ];
          const question = args.join(" ");
          const answer = answers[Math.floor(Math.random() * answers.length)];
          if(!question) return message.reply("You'll have to ask a question first!");
          if(question <= 0) return message.reply("Is that really a question?");
        //  if(question.includes("<@>")) return message.reply("That question includes mentioning a user!")
          const ballsEmbed = new Discord.EmbedBuilder()
          .setAuthor({
            name: message.author.tag,
            iconURL: message.author.displayAvatarURL()
          })
          
          .setTitle("Magic 8ball")
          .setDescription(
            `> Your question: ${question} \n > Magic 8ball said: ${answer}`
          )
          .setColor("White")
          .setTimestamp()
          message.reply({
            embeds: [ballsEmbed]
          })
    }
}