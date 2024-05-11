const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: `nowplaying`,
    description: `Provides information about the music being played.`,
    aliases: ["np"],
    category: "Music",
    run: async (client, message, args) => {
        const queue = client.player.getQueue(message.guild.id);
        if (!queue || !queue.playing) return message.reply("No music is currently playing.");
        const track = queue.songs[0];
        if (!track) return message.reply({ content: "No music is currently playing." }).catch(e => { })

        const embed = new EmbedBuilder();
        embed.setColor("Blurple");
        embed.setThumbnail(track.thumbnail);
        embed.setTitle(track.name)
        embed.setDescription(`> Audio \`%${queue.volume}\`
> Duration \`${track.formattedDuration}\`
> URL: **${track.url}**
> Loop Mode \`${queue.repeatMode ? (queue.repeatMode === 2 ? 'All Queue' : 'This Song') : 'Off'}\`
> Filter: \`${queue.filters.names.join(', ') || 'Off'}\`
> By: <@${track.user.id}>`);

        embed.setTimestamp();
        embed.setFooter({ text: `Cheeka music system!` })
        message.channel.send({embeds: [embed]})
    }
}