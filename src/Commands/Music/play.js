const { EmbedBuilder, ActionRowBuilder, ButtonStyle, ButtonBuilder } = require("discord.js");

module.exports = {
  name: `play`,
  description: `Plays a music`,
  aliases: ["p"],
  category: "Music",
  voicechannel: true,
  deleteTrigger: true,
  run: async (client, message, args) => {
    let name = args.join(" ");
    if (!name) return message.reply("Please enter the name of the song you want to play!");
    try {
      await client.player.play(message.member.voice.channel, name, {
        member: message.member,
        textChannel: message.channel,
        message
      })
      
    } catch (e) {
      message.reply("No result founded with your song name.").then(() => {
        console.log(e)
      })
    }
      const queue = client.player.getQueue(message.guild.id);
      const trackl = []
      queue.songs.map(async (track, i) => {
        trackl.push({
          title: track.name,
          author: track.uploader.name,
          user: track.user,
          url: track.url,
          duration: track.duration,
          thumbnail: track.thumbnail
        })
      })
      const trackl2 = {};
      for (let i = 0; i < trackl.length; i++) {
        Object.assign(trackl2, trackl[i]);
      }
      let time = trackl2.duration

      function n(num) {
        var s = num + "";
        while (s.length < 2) s = "0" + s;
        return s;
      }
      let sec = n(time % 60)
      let min = Math.floor(time / 60)
      let text = `${min}:${sec}`



      let embed = new EmbedBuilder()
        .setTitle("Music added to the queue")
        .setColor("Blurple")
        .setDescription(`${trackl2.title} \`${text}\``)
        .setThumbnail(`${trackl2.thumbnail}`)
        .setAuthor({name: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL()}`})
        .setTimestamp()
      message.reply({ embeds: [embed] })
      //     await interaction.editReply({ content: lang.msg60, ephemeral: true }).catch(e => { })
    }
  }