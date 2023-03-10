const { EmbedBuilder } = require("discord.js");
module.exports = {
    name: "dm",
    category: "Developers",
    description: "Dm a user",
    devsOnly: true,
    deleteTrigger: true,
    run: async (client, message, args) => {
        const user = await client.users.cache.get(args[0]) || message.mentions.users.first();
        args.shift();
        const Themessage = args.join(" ");
        if(!user) return message.author.send("Please enter a user to send a mesasage to!");
        if(!Themessage) return message.author.send("Please enter a message to send to a user!");
        user.send(Themessage);
    }
}