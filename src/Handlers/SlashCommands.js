const fs = require("fs")
const { REST } = require("@discordjs/rest")
const { Routes, Discord } = require("discord.js")
const { clientId } = require("../../config.json")
const slashcommands = []

fs.readdirSync(`./src/SlashCommands`).forEach(subfolder => {

    const slashcommandsFiles = fs.readdirSync(`./src/SlashCommands/${subfolder}`).filter(file => file.endsWith('.js'));

    for (const file of slashcommandsFiles) {
        const slash = require(`./../SlashCommands/${subfolder}/${file}`)
        slashcommands.push(slash.data.toJSON())
    }
})

const rest = new REST({ version: "10" }).setToken(process.env.token)
module.exports = async (client, createSlash) => {
    try {
        const data = await rest.put(
            Routes.applicationCommands(clientId),
            { body: slashcommands }
        )
        
        client.slashId = new Map(data.map((e) => [e.name, e.id]));
        require("colors")
        { console.log("╔═════════════════════════════════╗".brightGreen) }
        { console.log("║                                 ║".brightGreen) }
        { console.log("║      Slash commands ready!.     ║".brightGreen) }
        { console.log("║                                 ║".brightGreen) }
        { console.log("╚═════════════════════════════════╝".brightGreen) }
    } catch (e) {
        console.error(e)
    }
}