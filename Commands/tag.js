const Discord = require("discord.js");

module.exports = {
    name: "tag",
    description: "Tag System",
    run: async (client, message, args) => {
        if(!args[0]) {
            return message.channel.send({
                embeds: [
                    new Discord.EmbedBuilder()
                    .setTitle("Invalid Usage!")
                    .setDescription(
                        "Please use the following format! \n `tag <tagname/create/edit/delete> [tagname] [content]`"
                        )
                        .setTimestamp()
                        .setColor("Red")
                ]
            })

        }
        if(!args[0] === "create") {
            if(!args[1] || !args[2]) {
                return message.channel.send({
                    embeds: [
                        new Discord.EmbedBuilder()
                        .setTitle("Invalid Usage!")
                        .setColor("Red")
                        .setDescription(
                            "Please use the following format! \n `tag <tagname/create/edit/delete> [tagname] [content]`"
                            )
                            .setTimestamp(),
                    ]
                })
            }
        }
    }
}