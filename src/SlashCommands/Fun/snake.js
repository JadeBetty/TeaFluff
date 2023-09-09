const { SlashCommandBuilder, EmbedBuilder, Client } = require('discord.js');
const gamecord = require('discord-gamecord');
module.exports = {
    category: "Fun",
    data: new SlashCommandBuilder()
        .setName('snake')
        .setDescription('Snake Game On discord!'),
    async run(client, interaction) {
        const game = new gamecord.Snake({
            message: interaction,
            isSlashGame: true,
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