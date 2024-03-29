const { logger } = require("console-wizard");

module.exports = async (client) => {
    const fs = require('fs');
    fs.readdirSync('./src/Commands').forEach(folder => {
        let commands = fs
            .readdirSync(`./src/Commands/${folder}`)
            .filter(file => file.endsWith('.js'));
        commands.forEach(f => {
            const command = require(`./../Commands/${folder}/${f}`);
            client.commands.set(command.name, command);
        });
    });

    fs.readdirSync(`./src/Developers`).forEach(file => {
        const command = require(`./../Developers/${file}`);
        client.devsCommands.set(command.name, command)
    })

    logger.info(`Loaded ${client.commands.size} commands and ${client.devsCommands.size} developer commands!`);
}