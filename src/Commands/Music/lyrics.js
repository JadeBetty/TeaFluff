const Genius = require("genius-lyrics");
const Client = new Genius.Client(`${process.env.geniuskey}`);
const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "lyrics",
    description: "Find a lyrics for a song",
    devsOnly: true,
    deleteTrigger: true,
    run: async (client, message, args) => {
        const queue = client.player.getQueue(message.guild.id);
        if(!Array.isArray(args) || !queue) return message.reply("enter a lyrics name")
        let songTitle = args.join(" ") || queue.songs[0].name;
        songTitle = songTitle.replace(
            /lyrics|lyric|lyrical|official music video|\(official music video\)|audio|official|official video|official video hd|official hd video|offical video music|\(offical video music\)|extended|hd|(\[.+\])/gi,
            ""
        );
        const song = await Client.songs.search(songTitle);
        let lyrics = await song[0].lyrics();
        message.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`${song[0].title} - ${song[0].artist.name}`)
                    .setDescription(`\`\`\`${lyrics}\`\`\``)
                    .setColor("Blue")
                    .setTimestamp()
            ]
        })
    }
} 