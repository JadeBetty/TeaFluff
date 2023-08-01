const Discord = require("discord.js");
const gamecord = require("discord-gamecord")
module.exports = {
    name: "snake",
    description: "Snake Game",
    category: "Fun",
    deleteTrigger: true,
    run: async (client, message, args) => {
        const game = new gamecord.Snake({
            message: message,
            isSlashGame: false,
            embed: {
                title: 'Snake Game',
                overTitle: 'Snake Game - Game Over',
                color: '#a8f1b0'
            },
            emojis: {
                board: '⬛',
                food: '🍎',
                up: '⬆️',
                down: '⬇️',
                left: '⬅️',
                right: '➡️',
            },
            stopButton: 'Stop',
            timeoutTime: 60000,
            snake: { head: '🟢', body: '🟩', tail: '🟩', over: '💀' },
            foods: ['🍎'],
            playerOnlyMessage: 'Only {player} can use these buttons.'
        })
        await game.startGame();
    }
}