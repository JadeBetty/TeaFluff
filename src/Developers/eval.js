const { EmbedBuilder } = require("discord.js");
const config = require("../../config.json");
module.exports = {
    name: "eval",
    category: "Developers",
    description: "Evaulate a JavaScript code.",
    devsOnly: true,
    deleteTrigger: true,
    run: async (client, message, args) => {
        async function clean(text) {
            if (text && text.constructor.name === "Promise") text = await text;
            if (typeof text !== "string") text = require("util").inspect(text, { depth: 1 });
            text = text
                .replaceAll(process.env, "[Private Information]")
                .replaceAll(process.env.token, "[Token]")
                .replaceAll(process.env.mongo, "[Private Information]")
                .replace(/`/g, "`" + String.fromCharCode(8203))
                .replace(/@/g, "@" + String.fromCharCode(8203))


            return text;
        }
        try {
            const evaled = eval(args.join(" "));
            let cleaned = await clean(evaled);

            if (cleaned !== undefined) {
                message.author.send(`\`\`\`js\n${cleaned}\n\`\`\``).catch(err => { message.author.send("Theres nothing.") });
            }
        } catch (err) {
            message.author.send(`\`ERROR\` \`\`\`xl\n${err}\n\`\`\``).catch(r => { });
        }

        client.channels.cache.get(config.msgc).send({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Eval Command Used")
                    .addFields(
                        { name: "Command", value: "eval" },
                        { name: "Command Context", value: message.content },
                        { name: "User", value: `${message.author.tag} || ${message.author.id}` }
                    )
                    .setColor("#a8f1b0")
                    .setTimestamp()
            ]

        })

    }
}