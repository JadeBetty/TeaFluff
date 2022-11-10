const { SlashCommandBuilder, EmbedBuilder, Client, PermissionsBitField, PermissionFlagsBits } = require('discord.js');
const Docs = require('discord.js-docs');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Check for bot letency')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async run(client, interaction) {
        const { default: ms } = await import("pretty-ms")
        const timeStamp = new Date().getTime();
        let loading = await interaction.reply('Calculating Ping...');
        let botPing = loading.createdTimestamp - timeStamp;
        let apiPing = client.ws.ping;
        const pingEmbed = new EmbedBuilder()
        .setColor('Blurple')
        .setTitle(`:ping_pong: Ping Information`)
        .addFields(
          {name: 'Latency Information', value: `${botPing}ms`, inline: true},
          {name: "API's latency", value: `${apiPing}ms`, inline: true},
          {
            name: "Bot's uptime",
            value: `${ms(client.uptime)}`,
            inline: true,
          },
        )
        .setAuthor({
          name: `${interaction.user.tag}`,
          iconURL: `${interaction.user.displayAvatarURL({dynamic: true})}`,
        });
      await interaction.editReply({content: null, embeds: [pingEmbed]});
    }
}