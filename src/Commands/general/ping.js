
const { EmbedBuilder } = require("discord.js");
module.exports = {
  name: "ping",
  description: "Check for the bot legacy",
  aliases: ["pong"],
  category: "Administrator",
  permissions: ["Administrator"],
  cooldown: 8,
  run: async (client, message, args) => {
    const { default: ms } = await import("pretty-ms")
    const timeStamp = new Date().getTime();
    let loading = await message.reply('Calculating Ping...');
    let botPing = loading.createdTimestamp - timeStamp;
    let apiPing = client.ws.ping;
    const pingEmbed = new EmbedBuilder()
      .setColor('Blurple')
      .setTitle(`:ping_pong: Ping Information`)
      .addFields(
        { name: 'Latency Info', value: `${botPing}ms`, inline: true },
        { name: "API's latency", value: `${apiPing}ms`, inline: true },
        {
          name: "Bot's uptime",
          value: `${ms(client.uptime)}`,
          inline: true,
        },
      )
      .setAuthor({
        name: `${message.author.tag}`,
        iconURL: `${message.author.displayAvatarURL({ dynamic: true })}`,
      });
    await loading.edit({ content: null, embeds: [pingEmbed] });
  }

}
