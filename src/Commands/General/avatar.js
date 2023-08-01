const { EmbedBuilder } = require("discord.js");
module.exports = {
    name: "avatar",
    description: "Get avatar of a user",
    category: "General",
    aliases: ["av"],
    run: async (client, message, args) => {
        try {
            const user =
                message.mentions.users.first() ||
                message.guild.members.cache.get(args[0]) ||
                message.author;

            const username = user.username || user.user.username;
            const avatarEmbed = new EmbedBuilder()
                .setColor("#a8f1b0")
                .setTitle(`${username}'s Avatar`)
                .setImage(user.displayAvatarURL({ size: 2048 }))
                .setFooter({
                    text: `Requested by ${message.author.tag}`,
                    iconURL: message.author.displayAvatarURL({
                        size: 2048
                    })
                })
            message.reply({ embeds: [avatarEmbed] })
        } catch (err) {
            console.error(err);
            message.reply(`\`\`\`${err}\`\`\``);
        }
    }
}