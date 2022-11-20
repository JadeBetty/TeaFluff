const Discord = require("discord.js");
module.exports = {
    name: "info",
    description: "Bot infomation",
    category: 'General',
    aliases: ["Info", "Infomation", "information", "botinfo"],
    run: async (client, message, args) => {

        message.reply({
            embeds: [
                new Discord.EmbedBuilder()
                    .setTitle(`${client.user.username}'s Info`)
                    .setDescription(`This is a version of Cheeka in the __[IGP Server](https://discord.gg/igp-s-coding-villa-697495719816462436)__`)
                    .addFields(
                        { name: `Bot Created by`, value: `<@!758617912566087681> ( Founder of this version of Cheeka) \n` },
                        { name: `Special Thanks to:`, value: `<@!864372060305883136> ( Help fixing the mod mail) \n <@!283312847478325251> For some event handling help! \n <@!748597084134834186> For the wordle code! \n And also those people who helped me!` }
                    )
                    .setThumbnail(client.user.displayAvatarURL())
                    .setAuthor({
                        name: client.user.tag,
                        iconURL: client.user.displayAvatarURL(),
                    })
                    .setColor("#426b65")
                    .setFooter({ text: "Make sure to join IGP server!" })
                    .setTimestamp(),
            ]
        })
    }
}