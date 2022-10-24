module.exports = {
    name: `messageCreate`,
    async run(message, { client, Discord, snipe}) {
        let prefix = "-"
        let prefix2 = "."
        if (message.content.startsWith(prefix) || message.content.startsWith(prefix2))  {
            const args = message.content.slice(prefix.length).trim().split(/ +/g)
            const commandName = args.shift()
            const command = client.commands.get(commandName) || client.aliases.get(commandName)
            if (!command) return
            command.run(client, message, args)

        }
        if(message.content === "imagine is not cool") {
            message.channel.send("How dare you consider imagine is not cool?! You gotta get banned <:JimDullerDinglson:974359587136344064>.")
        }
    }

}