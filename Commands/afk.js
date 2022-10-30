const { EmbedBuilder } = require("discord.js")
const { afkUsers } = require("../utils/Cache")
module.exports = {
    name: "afk",
    description: "Marks you away from keyboard  aka AFK",
    aliases: ["away"],
    permissions: [],
    category: "General",
    run: async (client, message, args ) => {
        if(afkUsers.has(message.author.id)) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                    .setColor("Red")
                    .setDescription("You are already afk!"),
                ],
            });
        }
        let reason = args.join(" ");
        if(reason === "") reason =  "No reason provided.";
        if(reason.length > 60) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
            
                    .setColor("Red")
                    .setDescription(
                        "Your reason is too long! You can only provide 60 characters!",
                    ),
                ],
            });
        }

        afkUsers.set(message.author.id, {
            reason, 
            username: message.member.displayName,
            timestamp: Date.now()
        })
        try {
            await message.member.setNickname(
                `[AFK] ${
                    message.member.displayName.length > 32
                    ? message.member.displayName.slice(0, 32)
                    : message.member.displayName
                }`
            )
        } catch (ignored) {}
        return message.reply({
            embeds: [
                new EmbedBuilder()
                .setColor("Random")
                .setTitle("AFK!")
                .setDescription("I've set you to be AFK.")
                .addFields(
                    {name: "User", value: message.member.displayName},
                    {name: "Reason", value: reason}

                )
            ]
        })
     }
}