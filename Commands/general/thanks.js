const { EmbedBuilder } = require("discord.js");
const { thankCooldownCache, userCache } = require("../../utils/Cache");
const UserModel = require("../../schema/user");
const { thankslog } = require("../../config.json");
module.exports = {
    name: "thanks",
    description: "Thank a user for their help!",
    aliases: ["thank", 'ty'],
    category: 'General',
    run: async (client, message, args) => {
        let user = message.mentions.members.first();
        if (!user) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setDescription(
                            "You need to mention someone to thank them for their help!"
                        ),
                ],
            });
        }
        if (user.user.bot) 
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setDescription(
                            "You can't thank bots!",
                        ),
                ],
            });

        if (user.id === message.author.id)
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setDescription(
                            "You can't thank yourself for your help! You can thank someone else though!",
                        ),
                ],
            });


        let coolDown = thankCooldownCache.get(message.author.id);
        if (Date.now() - coolDown > 0 && Date.now() - coolDown < 45 * 60 * 1000) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setDescription(
                            `You can only thank ${user.user.tag} once every 45 minutes!`,
                        ),


                ],
            });
        }

        thankCooldownCache.set(message.author.id, Date.now());

        let thanks = userCache.get(user.id) || {
            thanks: 0,
            id: user.id,
        }

        thanks.thanks++;
        userCache.set(user.id, thanks);

        await UserModel.updateOne(
            {
                id: user.id,
            },
            { id: user.id, thanks: thanks.thanks },
            { upsert: true },
        );
        message.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor("Blurple")
                    .setTitle("Thanks added!")
                    .setDescription(
                        `${user} now has ${thanks.thanks} thanks \n\n **By:** ${message.author} | ||${message.author.id}|| \n **Thanks count** ${thanks.thanks}`,
                    )
                    .setFooter({
                        text: "use -ty to thanks others"
        })
                    .setTimestamp(),
            ],
        });
    
        client.channels.cache.get(thankslog).send({
            embeds: [
                {
                    colors: 'BLURPLE',
                    title: "New thank detected!",
                    description: `**Target** ${user.user.tag} | ||${user.user.id}|| \n **By:** ${message.author.tag} | ||${message.author.id}|| \n **Total Thanks:** ${thanks.thanks} \n **Channel:** ${message.channel} \n **Message:** [Click Here](${message.url})`
                },
            ],
        });
    },
};