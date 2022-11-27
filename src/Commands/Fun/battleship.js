const Discord = require("discord.js");
const { DiscordBattleShip } = require("discord-battleship");

const BattleShip = new DiscordBattleShip({embedColor: "Red", prefix: ["-", "."]});

module.exports = {
    name: "battleship",
    description: "Play a game of battle ship",
    aliases: ["bs"],
    category: "Fun",
    run: async (client, message, args) => {
        await BattleShip.createGame(message)
    }
}