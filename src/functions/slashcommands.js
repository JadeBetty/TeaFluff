const fs = require("fs")
const { REST } = require("@discordjs/rest")
const { Routes, Discord } = require("discord.js")
const { clientId } = require("../../config.json")
const slashcommands = []

fs.readdirSync(`./src/slashcommands`).forEach(subfolder => {

  const slashcommandsFiles = fs.readdirSync(`./src/slashcommands/${subfolder}`).filter(file => file.endsWith('.js'));

  for (const file of slashcommandsFiles) {
    const slash = require(`./../slashcommands/${subfolder}/${file}`)
    slashcommands.push(slash.data.toJSON())
  }
})

const rest = new REST({ version: "10" }).setToken(process.env.token)

module.exports = async function createSlash() {
  try {
    await rest.put(
      Routes.applicationCommands(clientId), {
      body: slashcommands
    }
    )
    await rest.put(
      Routes.applicationCommands(clientId),
      { body: slashcommands }
    )
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