const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: `resume`, 
    description: `a music`,
    aliases: ["r"],
    category: "Music",
    voicechannel: true,
    run: async (client, message, args) => {
      const queue = client.player.getQueue(message.guild.id);
      if (!queue || !queue.playing) return interaction.reply({ content: `No music is currently playing.`}).catch(e => { })
      const success = queue.resume();
      return message.reply({ content: success ? `**${queue.songs[0].name}** - music resumed.` : `Something went wrong!`,  }).catch(e => { })
    }
}