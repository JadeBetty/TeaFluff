module.exports = {
    name: `stop`,
    description: "Stops the current queue and disconnects from the voice channel.",
    voicechannel: true,
    category: "Music",
    run: async (client, message, args) => {
        let queue = client.player.getQueue(message.guild.id);
        if(!queue) return message.channel.send("No song is currently playing.")

        await queue.stop();
        return message.channel.send("Music stopped, leaving voice channel.");
    }
}