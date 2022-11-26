const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: `accept-suggestion`,
    description: "accept a suggestion!",
    permissions: ["ManageMessages"],
    aliases: ["ac-sug",],
    run: async (client, message, args) => {
        const messageID = args[0];
        const reason = args.slice(1).join(' ') || 'No reason given';

        const suggestionChannel = await message.guild.channels.fetch(
            '1045869650287796225',
        );
        if (!messageID) return message.reply('Please provide a message ID');
        const suggestedMsg = await suggestionChannel.messages.fetch(messageID);
        const suggestEmbed = suggestedMsg.embeds[0]
        let acceptedEmbed = new EmbedBuilder()
            .setAuthor({
                name: suggestEmbed.author.name,
                iconURL: suggestEmbed.author.iconURL,
            })
            .setTitle(suggestEmbed.title)
            .setDescription(suggestEmbed.description)
            .setColor("Green")
            .addFields({ name: `Status:`, value: `🟢 Nice idea! We're working on it!\n\n**Reason:** ${reason}` })
            .setFooter({
                text: `accepted by: ${message.author.tag}`,
                iconURL: `${message.author.displayAvatarURL({ dynamic: true })}`,
            });
        try {
            await suggestedMsg.edit({ embeds: [acceptedEmbed] });
            await message.reply('Suggestion accepted!');
        } catch (err) {
            console.log(err);
            await message.reply(`\`\`\`${err}\`\`\``);
        }


    }
}