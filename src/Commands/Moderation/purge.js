const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "purge",
    description: "Clear a certain amount of messages",
    aliases: ["clear", "clr", "prg"],
    permissions: ["ManageMessages"],
    deleteTrigger: true,
    category: "Moderation",
    run: async (client, message, args) => {
        const query = args[0];

        if (query > 100) {
            return message.channel.send(
                'You cannnot delete more than 100 messages at once!',
            ).then(msg => {
                setTimeout(() => {
                    msg.delete()
                }, 5000)
            })
        }
        if (isNaN(query)) {
            return message.channel.send('Invalid amount given, amount must be a number!').then(msg => {
                setTimeout(() => {
                    msg.delete()
                }, 5000)
            })
        }
        try {
            const amount = parseInt(query);
            const fetched = await message.channel.messages.fetch({
                limit: amount + 1,
            });

            await message.channel.bulkDelete(fetched, true).then(
                message.channel
                    .send({
                        embeds: [
                            {
                                color: '5763719',
                                title: `:broom: Successfully deleted ${amount} messages!`,
                            },
                        ],
                    })
                    .then(msg => {
                        setTimeout(() => {
                            msg.delete();
                        }, 3000);
                    }),
            );
        } catch (error) {
            console.log(error);
        }
    },
}
