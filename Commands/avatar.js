const { EmbedBuilder} = require("discord.js");
const messageCreate = require("../Events/messageCreate");

module.exports = {
    name: "avatar",
    desription: "Get avatar of a user",
    category: "General",
    aliases: ["av"],
    usage: "avatar [user]",
    run: async (client, message, args) => {
        try {
            const user =
            message.mentions.users.first() ||
            message.guild.members.cache.get(args[0]) ||
            message.author;

            const username = user.username || user.user.username;
            const avatarEmbed = new EmbedBuilder()
            .setColor("Blurple")
            .setTitle(`${username}'s Avatar`)
            .setImage(user.displayAvatarURL({size: 2048}))
            .setFooter({
                text: `Requested by ${message.author.tag}`,
                iconURL: message.author.displayAvatarURL({
                    size: 2048
                })
            })
            message.reply({embeds: [avatarEmbed]})
        } catch (err) {
            console.error(err);
            message.reply(`\`\`\`${err}\`\`\``);
        }
    }
}