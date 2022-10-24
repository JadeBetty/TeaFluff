module.exports = {
    name: `messageCreate`,
    async run(message, { client, Discord, snipe, prefix }) {
        if (message.content.startsWith(prefix)) {
            const args = message.content.slice(prefix.length).trim().split(/ +/g)
            const commandName = args.shift()
            const command = client.commands.get(commandName) || client.aliases.get(commandName)
            if (!command) return
            command.run(client, message, args)
        }
    }

}