const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: `pause`, 
    description: `Pauses the music currently playing.`,
    aliases: ["pa"],
    category: "Music",
    voicechannel: true,
    run: async (client, message, args) => {
      const queue = client.player.getQueue(message.guild.id);
      if (!queue || !queue.playing) return interaction.reply({ content: `No music is currently playing.`}).catch(e => { })
      const success = queue.pause();
      return message.reply({ content: success ? `**${queue.songs[0].name}** - music paused` : `Something went wrong!`,  }).catch(e => { })
    }
}