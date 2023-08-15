const { EmbedBuilder } = require("discord.js")
module.exports = {
    name: "afk",
    description: "Sets you an Afk Status",
    aliases: ["away"],
    category: "General",
    deletetrigger: true,
    afk: new Map(),
    run: async (client, message, args) => {
        const afkUsers = require("../General/afk").afk;
        if (afkUsers.has(message.author.id)) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setDescription("You are already afk!"),
                ],
            });
        }
        let reason = args.join(" ");
        if (reason === "") reason = "No reason provided.";
        if (reason.length > 60) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()

                        .setColor("#f09999")
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
                `[AFK] ${message.member.displayName.length > 32
                    ? message.member.displayName.slice(0, 32)
                    : message.member.displayName
                }`
            )
        } catch (ignored) {
            message.channel.send({
                embeds: [
                    new EmbedBuilder()
                    .setColor("#f09999")
                    .setTitle("Invalid Permissions")
                    .setDescription("I do not have the permissions to edit your nickname!")
                ]
            })
        }
        return message.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor("#a8f1b0")
                    .setTitle("Afk Status")
                    .setDescription("I've set you to be afk!")
                    .addFields(
                        { name: "User", value: message.member.displayName },
                        { name: "Reason", value: reason }

                    )
            ]
        })
    },
}