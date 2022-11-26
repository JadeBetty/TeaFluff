const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "suggest",
    description: "Suggest something",
    category: "Suggestion",
    run: async (client, message, args) => {
        let suggestion = args.join(" ");
        let suggestionchan = client.channels.cache.get('1045869650287796225');
        if (!suggestion) return message.reply("Please specify a suggestion!")
        let suggestEmebd = new EmbedBuilder()
            .setAuthor({
                name: `${message.author.tag}`,
                iconURL: `${message.author.displayAvatarURL()}`,
            })
            .setTitle(`${message.author.username} suggests:`)
            .setDescription(`- ${suggestion}`)
            .setColor(`White`)
            .addFields(
                { name: `Status`, value: `📊 Wait for community feedback. Please vote!` }
            )
            .setFooter({ text: 'Wanna suggest something too?  try .suggest <suggestion>' })

        const suggestedMsg = await suggestionchan.send({
            embeds: [suggestEmebd],
        });

        await suggestedMsg.react('✔');
        await suggestedMsg.react('❌');

        await message.reply(
            'Your suggestion has been sent in <#1045869650287796225>',
        );
    }
}