const fs = require("fs");
const { ActivityType, WebhookClient, EmbedBuilder } = require("discord.js");
const elogger = new WebhookClient({ url: process.env.errorLogWebhook });
const { logger } = require("console-wizard");
const knownErrorsSchema = require("../Schema/knownErrors");
const _ = require('underscore');

module.exports = async function handleError(error) {
    const knownErrorsData = await knownErrorsSchema.findOne({ error: error.name });
    if (knownErrorsData) return logger.info(`${error.name ? error.stack : error} has already been encountered`);

    const client = require("../imports/client.js");
    client.user.setPresence({
        activities: [{
            name: "An error has occurred",
            type: ActivityType.Custom
        }],
        status: "idle"
    });

    fs.readFileSync("config.json", 'utf-8', (err, data) => {
        if (err) return console.log(err);
        data = data.toString();
        fs.writeFileSync("config.json", data.replace("\"maintainence\": false", "\"maintainence\": true"), (err) => { console.log(err) });
    });

    if (!error) error = { stack: "No error provided" };
    logger.error(error);

    elogger.send({
        embeds: [
            new EmbedBuilder()
                .setTitle("New error encountered")
                .setDescription(`\`\`\`${error.stack}\`\`\``)
                .setFooter({ text: `TeaFluff` })
                .setColor("#f09999")
        ]
    });

    await knownErrorsSchema.create({ error: error.name, stack: error.stack });
}