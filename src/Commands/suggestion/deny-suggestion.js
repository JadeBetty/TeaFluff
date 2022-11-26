const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: `deny-suggestion`,
    description: "Deny a suggestion!",
    aliases: ["deny-suggest", "d-sug"],
    permissions: ["ManageMessages"],
    category: "Suggestion",
    run: async (client, message, args) => {
        const messageID = args[0];
        const reason = args.slice(1).join(' ') || 'No reason given';
        const suggestionChannel = await message.guild.channels.fetch(
            '1045869650287796225',
        );
        const suggestedMsg = await suggestionChannel.messages.fetch(messageID);
        const suggestEmbed = suggestedMsg.embeds[0];

        if (!messageID) return message.reply('Please provide a message ID');
        let deniedEmbed = new EmbedBuilder()
            .setAuthor({
                name: suggestEmbed.author.name,
                iconURL: suggestEmbed.author.iconURL,
            })

            .setTitle(suggestEmbed.title)
            .setDescription(suggestEmbed.description)
            .setColor("Red")
            .addFields({
                name: `Status`,
                value: `🔴 Thank you for your suggestion, but the community doesn't seem to be interested in it for now\n\n**Reason:** ${reason}`
            })
            .setFooter({
                text: `denied by: ${message.author.tag}`,
                iconURL: `${message.author.displayAvatarURL({ dynamic: true })}`,
            });

        try {
            await suggestedMsg.edit({ embeds: [deniedEmbed] });
            await message.reply('Suggestion denied!');
        } catch (err) {
            console.log(err);
            await message.reply(`\`\`\`${err}\`\`\``);
        }

    }

}