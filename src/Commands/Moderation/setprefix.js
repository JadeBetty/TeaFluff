const { EmbedBuilder } = require("discord.js");
const GuildSchema = require("../../Schema/Guild").GuildData;

module.exports = {
    name: "prefix",
    description: "Set the server prefix.",
    category: "Moderation",
    permissions: ["KickMembers"],
    deleteTrigger: true,
    run: async (client, message, args) => {
        let guild = await GuildSchema.findOne({ guild: message.guild.id });
        if (!guild) {
            guild = await GuildSchema.create({
                id: message.guild.id
            })
        }
        const command = args[0];
        if (!command) return message.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Invalid Usage!")
                    .addFields(
                        { name: `Usage`, value: `${guild.prefix}prefix <set/reset> <prefix>` },
                        { name: `Note`, value: `Make sure that your prefix doesn't contain any spaces!` }
                    )
                    .setColor("#f09999")
            ]
        })
        args.shift();
        const prefix = args.join(" ");
        if (!prefix) return message.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Invalid Usage!")
                    .addFields(
                        { name: `Usage`, value: `${guild.prefix}prefix <set/reset> <prefix>` },
                        { name: `Note`, value: `Make sure that your prefix doesn't contain any spaces!` }
                    )
                    .setColor("#f09999")
            ]
        })
        if (prefix.includes(" ")) return message.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Invalid Usage!")
                    .setDescription(`The prefix you provided contains a space!`)
                    .setColor("#f09999")
            ]
        })
        if (command === "set") {
            await GuildSchema.findOneAndUpdate({
                guild: message.guild.id
            }, {
                prefix: prefix
            });
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                    .setDescription(`Successfully changed server prefix to \`${prefix}\``)
                    .setColor("#a8f1b0")
                ]
            })
        } else if(command === "reset") {
            await GuildSchema.findOneAndUpdate({ guild: message.guild.id }, { prefix: "."});
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                    .setDescription(`Successfully resetted server prefix to \`${prefix}\``)
                    .setColor("#a8f1b0")
                ]
            })
        }



    }
}